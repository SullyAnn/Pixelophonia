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

      <ButtonStart :index="question.id" @click.native="toggleQuestion" />
    </div>

    <div v-if="question.temps" class="timeQuestionOptions">
      <div class="timerWrapper">
        <div ref="timeProgress" class="timeProgress" id="timeProgress"></div>
      </div>
    </div>

    <div v-if="!question.temps" class="btnLaunchResults">
      <!-- si la question est infinie, mettre un bouton pour choisir quand lancer le calcule des résultats -->
      <div v-if="questionIsPlaying && displayBtnLancerResultat">
        <button @click="launchResultsNoTimer()">Lancer les résultats</button>
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
import "@/assets/css/launch.css";
import "@/assets/css/admin.css";

export default {
  props: {
    question: Object,
  },

  watch: {
    activeTimer() {
      this.launchTimer(Date.now(), this.question.temps); //lancer le timer chez l'admin
    },
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

  beforeMount() {
    socket.on("augmentation-nb-votes", (votesInfos) => {
      this.votesData = votesInfos;
    });

    this.$root.$on("checkTime-state", (state) => {
      this.timerBar = state;
    });
    this.$root.$on("checkDirectResult-state", (state) => {
      this.directResult = state;
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
    toggleQuestion: function () {
      this.questionIsPlaying = !this.questionIsPlaying;

      if (this.questionIsPlaying) {
        //on lance une question
        const questionStartTime = Date.now(); //temps de départ de la question

        //display de la barre de temps ou non
        let showTimerOnScreen = this.displayTimer(this.question.temps);

        //display des votes ou non
        let showDirectResultsOnScreen = this.displayVotes();

        socket.emit(
          "display-question",
          this.question,
          questionStartTime,
          showTimerOnScreen,
          showDirectResultsOnScreen
        );

        if (this.question.temps) {
          //si il y a un temps défini pour la question
          this.activeTimer = true;

          this.launchTimer(questionStartTime, this.question.temps); //lancer le timer chez l'admin
        }
      } else {
        //sinon c'est qu'on est en train de l'arrêter
        socket.emit("stop-question", 1);
        this.resetDisplay(this.question.temps);
      }
    },

    launchTimer: function (questionStartTime, totalTime) {
      //======== TIMER ========//
      const timeDepart = questionStartTime;
      const totalTimeMs = totalTime * 1000; //on passe le temps en secondes en millisecondes

      let progressBar = this.$refs["timeProgress"];

      let myTimer = setInterval(() => {
        let currentTime = Date.now();

        let tempsEcoule = currentTime - timeDepart; //en millisecondes

        if (tempsEcoule <= totalTimeMs) {
          progressBar.style.width =
            "calc(16px + (" + tempsEcoule / totalTimeMs + " * (100% - 16px)))";
          if ((tempsEcoule / totalTimeMs) * 100 > 75) {
            progressBar.style.backgroundColor = "#CA4B4B"; //on passe en rouge
          }
        } else {
          socket.emit("calcul-resultat");
          clearInterval(myTimer);
        }

        if (!this.questionIsPlaying) {
          //si on arrete la question avant la fin
          progressBar.style.width = 0 + "%";
          progressBar.style.backgroundColor = "#0CB4CE";
          clearInterval(myTimer);
        }
      }, 10);
    },

    resetDisplay: function (temps) {
      this.indexQuestionPlaying = -1;
      this.displayBtnLancerResultat = true;
      this.votesData = { total: 0, votesChoice1: 0, votesChoice2: 0 };
      this.activeTimer = false;

      if (temps) {
        //on réinitialise la barre de progrès
        let progressBar = this.$refs.timeProgress;

        progressBar.style.backgroundColor = "#0CB4CE";
        progressBar.style.width = 0 + "%";
      }
    },
    launchResultsNoTimer: function () {
      if (this.questionIsPlaying) {
        socket.emit("calcul-resultat");
        this.displayBtnLancerResultat = false;
        this.activeTimer = false;
      }
      this.questionIsPlaying = false;
    },
  },
};
</script>

<style scoped>
</style>