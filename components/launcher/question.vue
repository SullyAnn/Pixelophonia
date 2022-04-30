<template>
  <li>
    <div class="labelAndStartBtnWrapper">
      <div>
        <p>{{ question.label }}</p>
        <div class="settingsContainer">
          <span>Paramètres sur l'écran</span>

          <!-- voir les résultats en direct -->
          <ButtonSwitch
            text="Résultats en direct"
            switchName="checkDirectResult"
            :idQuestion="question.id"
          />

          <!-- voir la barre de temps -->
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

    <div v-if="questionIsPlaying">
      <div v-if="timerBar">
        <div class="timerWrapper">
          <div class="timeProgress" :id="'timeProgress' + question.id"></div>
        </div>
      </div>
      <div v-else class="btnLaunchResults">
        <button @click="launchResultsNoTimer()">Lancer les résultats</button>
      </div>

      <LauncherTableVotes
        :title1="question.choices[0].title"
        :title2="question.choices[1].title"
      />
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
    questionIsPlaying() {
      if (this.questionIsPlaying) {
        this.launchQuestion();
      } else {
        socket.emit("stop-question", 1);
      }
    },
  },

  data() {
    return {
      questionIsPlaying: false,
      directResult: false,
      timerBar: false,
    };
  },

  beforeMount() {
    this.$root.$on("checkTime-state", (id, state) => {
      if (this.question.id == id) this.timerBar = state;
    });

    this.$root.$on("checkDirectResult-state", (id, state) => {
      if (this.question.id == id) this.directResult = state;
    });
  },

  methods: {
    displayTimer: function (timer) {
      if (timer) return this.timerBar;
      else return false;
    },

    launchQuestion: function () {
      const questionStartTime = Date.now();

      socket.emit(
        "display-question",
        this.question,
        questionStartTime,
        this.timerBar,
        this.directResult
      );

      // launch admin timer
      if (this.timerBar) {
        this.$nextTick(() => {
          this.launchTimer(questionStartTime, this.question.temps); 
        });
      }
    },

    toggleQuestion: function () {
      this.questionIsPlaying = !this.questionIsPlaying;
    },

    launchTimer: function (questionStartTime, totalTime) {
      //======== TIMER ========//
      const timeDepart = questionStartTime;
      const totalTimeMs = totalTime * 1000; //on passe le temps en secondes en millisecondes

        let progressBar = document.getElementById(
          "timeProgress" + this.question.id
        );

      let myTimer = setInterval(() => {
        let currentTime = Date.now();

        let tempsEcoule = currentTime - timeDepart; //en millisecondes

        if (tempsEcoule <= totalTimeMs) {
          console.log(progressBar.style.width)
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

    launchResultsNoTimer: function () {
        socket.emit("calcul-resultat");
      this.questionIsPlaying = false;
    },
  },
};
</script>

<style scoped>
</style>