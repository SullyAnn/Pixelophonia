<template>
  <li>
    <div class="labelAndStartBtnWrapper">
      <div>
        <p>{{ question.label }}</p>

        <div class="settingsContainer">
          <span>Paramètres sur l'écran</span>
          <!-- option de visibilité des résultats en direct -->
          <ButtonSwitch
            text="Résultats en direct"
            switchName="checkDirectResult"
            :idQuestion="question.id"
            :selected="0"
          />

          <!-- option de visibilité du temps -->
          <ButtonSwitch
            v-if="question.temps"
            text="Barre de temps"
            switchName="checkTime"
            :idQuestion="question.id"
            :selected="question.temps"
          />
        </div>
      </div>

      <ButtonStart
        :index="question.id"
        @click.native="toggleQuestion(question, question.id)"
      />
    </div>

    <div
      v-if="question.temps"
      class="timeQuestionOptions"
      id="timeProgress"
      ref="timeProgress"
    >
      {{ activeTimer }}
      <div v-if="activeTimer" class="timerWrapper">
        coucou
        <div class="timeProgress"></div>
      </div>
    </div>

    <div v-else class="btnLaunchResults">
      <!-- si la question est infinie, mettre un bouton pour choisir quand lancer le calcul des résultats -->
      <div v-if="questionIsPlaying && displayBtnLancerResultat">
        <button @click="launchResultsNoTimer(question.id)">
          Lancer les résultats
        </button>
      </div>
    </div>

    <!-- nombre de votes courants sur la question -->
    <div v-if="questionIsPlaying" class="nbTotalVotes">
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
</template>

<script>
import socket from "~/plugins/socket.io.js";

export default {
  props: {
    question: Object,
  },

  data() {
    return {
      questionIsPlaying: false,
      directResult: false,
      timerBar: false,
      activeTimer: false,
      votesData: {
        total: 0,
        votesChoice1: 0,
        votesChoice2: 0,
      },
      displayBtnLancerResultat: true,
    };
  },

  created() {
    console.log(this.question);
  },

  beforeMount() {
    this.$root.$on("checkTime-state", (id, state) => {
      if (state) this.timerBar = true;
      else this.timerBar = false;
    });
    this.$root.$on("checkDirectResult-state", (id, state) => {
      if (state) this.directResult = true;
      else this.directResult = false;
    });
  },

  methods: {
    setSwitches: function () {
      if (question.temps != 0) this.displayTimer = true;
    },

    displayTimer: function (timer) {
      if (timer) {
        return this.timerBar;
      } else return false;
    },

    displayVotes: function () {
      return this.directResult;
    },

    // launch one question : à voir pour grouper avec switch class ?
    toggleQuestion: function (questiondata, idQuestionList) {
      this.questionIsPlaying = !this.questionIsPlaying;

      if (this.questionIsPlaying) {
        //on lance une question
        const questionStartTime = Date.now(); //temps de départ de la question

        //display de la barre de temps ou non
        let showTimerOnScreen = this.displayTimer(questiondata.temps);

        //display des votes ou non
        let showDirectResultsOnScreen = this.displayVotes();

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
        this.resetDisplay(questiondata.temps);
      }
    },

    launchTimer: function (questionStartTime, totalTime) {
      this.activeTimer = true;
      //======== TIMER ========//
      const timeDepart = questionStartTime;
      const totalTimeMs = totalTime * 1000; //on passe le temps en secondes en millisecondes

      console.log("test", this.activeTimer);
      const element = this.$refs.timeProgress;
      console.log("ha", element);

      let myTimer = setInterval(() => {
        let currentTime = Date.now();

        let tempsEcoule = currentTime - timeDepart; //en millisecondes

        if (tempsEcoule <= totalTimeMs) {
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

    resetDisplay: function (temps) {
      this.indexQuestionPlaying = -1;
      this.displayBtnLancerResultat = true;
      this.votesData = { total: 0, votesChoice1: 0, votesChoice2: 0 };

      if (temps) {
        this.activeTimer = false;

        //on réinitialise la barre de progrès
        var progressBar = this.$refs.timeProgress;

        progressBar.style.backgroundColor = "#0CB4CE";
        progressBar.style.width = 0 + "%";
      }
    },
  },
};
</script>

<style scoped>
</style>