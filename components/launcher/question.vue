<template>
  <li>
    <p class="label">
      <b>{{ question.label }} </b> | <i> {{ question.question }}</i>
    </p>

    <div class="settingsContainer">
      <div class="settings" v-if="!questionIsPlaying">
        <span>Paramètres</span>

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

      <div v-else class="settings">
        <div v-if="timerBar" class="timeContainer">
          <img src="@/assets/icons/clock.svg" class="icon" />
          <div class="questionTime">
            <p>{{ question.temps }} secondes</p>
            <ElementTimer :totalTime="question.temps * 1000" />
          </div>
        </div>
        <div v-else class="timeContainer">
          <div class="icon">
            <ElementSpinner />
          </div>
          <LauncherButtonResult @click.native="launchResult()" :launchedResults="launchedResults" />
        </div>

        <LauncherTableVotes
          :title1="question.choices[0].title"
          :title2="question.choices[1].title"
        />
      </div>

      <ButtonStart :index="question.id" @click.native="toggleQuestion" />
    </div>
  </li>
</template>

<script>
import socket from "~/plugins/socket.io.js";
import "@/assets/css/admin.css";

export default {
  props: {
    question: Object,
  },

    data() {
      return {
        questionIsPlaying: false,
        directResult: false,
        timerBar: false,
        launchedResults: false
      };
    },

  watch: {
    questionIsPlaying() {
      if (this.questionIsPlaying) {
        this.launchQuestion();
      } else {
        socket.emit("stop-question", 1);
      this.launchedResults = false;
      }
    },
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

    launchTimer: function (startTime, totalTime) {
      let myTimer = setInterval(() => {
        if (!this.questionIsPlaying) {
          this.stopTimer(myTimer);
        } else if (Date.now() - startTime > totalTime * 1000) {
          socket.emit("calcul-resultat");
          this.stopTimer(myTimer);
        }
      }, 10);
    },

    stopTimer: function (timer) {
      clearInterval(timer);
      this.$root.$emit("stop-timer");
    },

    launchResult: function () {
      socket.emit("calcul-resultat");
      this.launchedResults = true;
    },
  },
};
</script>

<style scoped>
.settingsContainer {
  padding: 8px 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0 0 16px 16px;
}

li {
  margin-top:30px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 5px 5px 5px rgba(180, 180, 1880, 0.5);
}
.settingsContainer span {
  display: block;
  font-weight: bold;
}

.settings * {
  margin: 5px;
}

.icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.icon * {
  max-width: 100%;
  max-height: 100%;
  min-width: 100%;
}

.timeContainer {
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 100%;
}

.questionTime {
  width: 100%;
}

.label {
  background-color: #3d4d7c;
  color: #fff;
  margin-bottom: 0;
  border-radius: 16px 16px 0 0;
  width: 100%;
  padding: 8px 24px;
  box-sizing: border-box;
  
}
</style>