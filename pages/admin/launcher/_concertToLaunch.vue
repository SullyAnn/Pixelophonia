<!-- questions contenues dans le concert -->
<template>
  <div>
    <AdminHeader />
    <div id="listQuestions" class="questionsList launchPage launchContainer">
      <h1>Liste des questions</h1>
      <ul ref="questions" class="questions">
        <li
          v-for="(question, index) in tabQuestions"
          :key="index"
          class="question"
          ref="questionInList"
        >
          <div class="labelAndStartBtnWrapper">
            <div>
              <p>{{ question.label }}</p>

              <div class="settingsContainer">
                <span>Paramètres sur l'écran</span>
                <!-- option de visibilité des résultats en direct -->
                <label class="checkLabel checkDirectResultLabel switch">
                  Résultats en direct<input
                    type="checkbox"
                    name="checkDirectResult"
                    class="checkDirectResult"
                  /><span class="slider round"></span>
                </label>
                <!-- option de visibilité du temps -->
                <div v-if="question.temps">
                  <label class="checkLabel checkTimeLabel switch">
                    Barre de temps<input
                      type="checkbox"
                      name="checkTime"
                      class="checkTime"
                      checked
                    /><span class="slider round"></span>
                  </label>
                </div>
              </div>
            </div>

            <ButtonStart
              :index="index"
              @click.native="toggleQuestion(question, index)"
            />
          </div>

          <div v-if="question.temps" class="timeQuestionOptions">
            <div class="timerWrapper">
              <div id="timeProgress" class="timeProgress"></div>
            </div>
          </div>

          <div v-if="!question.temps" class="btnLaunchResults">
            <!-- si la question est infinie, mettre un bouton pour choisir quand lancer le calcule des résultats -->
            <div
              v-if="
                questionIsPlaying &&
                indexQuestionPlaying == index &&
                displayBtnLancerResultat
              "
            >
              <button @click="launchResultsNoTimer(index)">
                Lancer les résultats
              </button>
            </div>
          </div>

          <!-- nombre de votes courants sur la question -->
          <div
            v-if="questionIsPlaying && indexQuestionPlaying == index"
            class="nbTotalVotes"
          >
            <table>
              <tr>
                <th colspan="2">Nombre de votes</th>
              </tr>
              <tr>
                <td>{{ question.choices[0].title }}</td>
                <td>{{ votesData.votesChoice1 }}</td>
              </tr>
              <tr>
                <td>{{ question.choices[1].title }}</td>
                <td>{{ votesData.votesChoice2 }}</td>
              </tr>
              <tr>
                <th>Total</th>
                <th>{{ votesData.total }}</th>
              </tr>
            </table>
          </div>
        </li>
      </ul>
    </div>

    <ButtonReturn
      @click.native="stopPartie()"
      linkBack="../launch"
      text="Mettre fin au jeu"
    />
  </div>
</template>


<script>
import "@/assets/css/admin.css";
import "@/assets/css/launch.css";
import socket from "~/plugins/socket.io.js";
import Choice from "@/assets/classes/Choice.js";
import Question from "@/assets/classes/Question.js";
import { getQuestion, getConcert } from "@/assets/classes/Admin.js";

export default {
  head: {
    title: "Lancer le jeu",
  },

  async asyncData({ $axios, params }) {
    try {
      const id = params.concertToLaunch;
      const concert = await getConcert($axios, id);
      const questionsInConcert = [];

      // add to questions all questions contained in concert
      for (let element of concert.questions) {
        questionsInConcert.push(await getQuestion($axios, element.questionId));
      }
      return { concert, questionsInConcert };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      newQuestion: null,
      newChoice: [],
      isReload: false,
      questionIsPlaying: false,
      indexQuestionPlaying: -1,
      votesData: { total: 0, votesChoice1: 0, votesChoice2: 0 },
      displayBtnLancerResultat: true,
      tabQuestions: [],
    };
  },
  created() {
    this.newQuestion = new Question(null, null, null, null);
  },
  beforeMount() {
    socket.on("augmentation-nb-votes", (votesInfos) => {
      this.votesData = votesInfos;
    });
  },
  mounted() {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      console.info("This page is reloaded");
      (this.reload = true), socket.emit("reload-all-pages", this.isReload);
    } else {
      console.info("This page is not reloaded");
    }

    this.launchPartie();
  },

  methods: {
    // ========= BACK ========== //

    // start game
    launchPartie: function () {
      this.tabQuestions = [];
      socket.emit("affichage-menu", 1);

      // get all questions in database
      this.questionsInConcert.forEach((question) => {
        // instanciate Choice objects in question
        question.choices.forEach((choice) => {
          this.newChoice.push(new Choice(choice.id, choice.title, choice.img));
        });

        // instanciate Question object
        (this.newQuestion = new Question(
          question.id,
          question.label,
          question.question,
          question.temps,
          this.newChoice
        )),
          this.tabQuestions.push(this.newQuestion);
        this.newChoice = [];
      });
    },

    // launch one question : à voir pour grouper avec switch class ?
    toggleQuestion: function (questiondata, idQuestionList) {
      this.questionIsPlaying = !this.questionIsPlaying;

      if (this.questionIsPlaying) {
        //on lance une question
        this.indexQuestionPlaying = idQuestionList;
        const questionStartTime = Date.now(); //temps de départ de la question

        //display de la barre de temps ou non
        let showTimerOnScreen = false;
        if (questiondata.temps) {
          //si la question est timée, on regarde si l'admin a coché la case visibilité ou pas
          showTimerOnScreen =
            this.$refs["questionInList"][idQuestionList].querySelector(
              ".checkTime"
            ).checked;
        } else {
          //sinon c'est que la question a un temps indéterminé
          showTimerOnScreen = false;
        }

        //display des votes ou non
        let showDirectResultsOnScreen = false;
        if (
          this.$refs["questionInList"][idQuestionList].querySelector(
            ".checkDirectResult"
          ).checked
        ) {
          showDirectResultsOnScreen = true;
        }
        socket.emit(
          "display-question",
          questiondata,
          questionStartTime,
          showTimerOnScreen,
          showDirectResultsOnScreen
        );
        if (questiondata.temps) {
          //si il y a un temps défini pour la question
          this.launchTimer(
            questionStartTime,
            questiondata.temps,
            idQuestionList
          ); //lancer le timer chez l'admin
        }
      } else {
        //sinon c'est qu'on est en train de l'arrêter
        socket.emit("stop-question", 1);
        this.indexQuestionPlaying = -1;
        this.displayBtnLancerResultat = true;
        this.votesData = { total: 0, votesChoice1: 0, votesChoice2: 0 };
        if (questiondata.temps) {
          //réinitialisation de la bar pour question à temps
          const timerWrapper =
            this.$refs["questionInList"][idQuestionList].querySelector(
              ".timerWrapper"
            );
          timerWrapper.style.cssText = "display:none;";
          var element =
            this.$refs["questionInList"][idQuestionList].querySelector(
              ".timeProgress"
            );
          element.style.backgroundColor = "#0CB4CE"; //on réinitialise la barre de progrès
          element.style.width = 0 + "%";
        }
      }
    },

    // ========= FRONT ========= //

    stopPartie: function () {
      socket.emit("stop-partie", 2);
      // this.$router.push("../launch");
    },
    launchTimer: function (questionStartTime, totalTime, idQuestionList) {
      const timerWrapper =
        this.$refs["questionInList"][idQuestionList].querySelector(
          ".timerWrapper"
        );
      timerWrapper.style.cssText = "display:block;";
      //======== TIMER ========//
      const timeDepart = questionStartTime;
      const totalTimeMs = totalTime * 1000; //on passe le temps en secondes en millisecondes

      var element =
        this.$refs["questionInList"][idQuestionList].querySelector(
          ".timeProgress"
        );

      let myTimer = setInterval(() => {
        let currentTime = Date.now();

        let tempsEcoule = currentTime - timeDepart; //en millisecondes

        if (tempsEcoule <= totalTimeMs) {
          //element.style.width = (tempsEcoule/totalTimeMs)*100 + "%";
          element.style.width =
            "calc(16px + (" + tempsEcoule / totalTimeMs + " * (100% - 16px)))";
          if ((tempsEcoule / totalTimeMs) * 100 > 75) {
            element.style.backgroundColor = "#CA4B4B"; //on passe en rouge
          }
        } else {
          socket.emit("calcul-resultat");
          clearInterval(myTimer);
        }

        if (!this.questionIsPlaying) {
          //si on arrete la question avant la fin
          element.style.width = 0 + "%";
          element.style.backgroundColor = "#0CB4CE";
          clearInterval(myTimer);
        }
      }, 10);
    },
    launchResultsNoTimer: function (idQuestionList) {
      if (this.questionIsPlaying) {
        //on vérifie qu'il y a bien une question en cours pour lancer les résultats
        socket.emit("calcul-resultat");
        //this.indexQuestionPlaying = -1 //fait disparaître le bouton pour lancer les résultat de sorte qu'on le lance qu'une seule fois
        this.displayBtnLancerResultat = false;
      }
    },
  },
};
</script>
