<template>
  <section>
    <div v-if="question" v-show="isQuestionDisplayed" id="choicePageContent">
      <div v-if="!displayResult" class="container">
        <PlayerOrBlock
          :isChoiceSubmitted="choiceIsSubmitted"
          :choices="question.choices"
          :selectedId="choiceId"
        />

        <PlayerOneChoice
          v-for="(data, index) in question.choices"
          :key="index"
          :choiceData="data"
          :idChoice="question.choices[index].id"
          :idQuestion="question.id"
          :isAChoiceSubmitted="choiceIsSubmitted"
        />
      </div>

      <PlayerResult
        v-else
        :isChoiceSubmitted="choiceIsSubmitted"
        :isPlayerChoiceWinner="isPlayerChoiceWinner"
        :idQuestion="question.id"
        :img="parameters.winnerChoice.img"
      />
    </div>

    <PlayerHomePage v-show="!isQuestionDisplayed" :affichage="affichage" />
  </section>
</template>

<script>
import socket from "~/plugins/socket.io.js";
import "../assets/css/playerChoice.css";
import "../assets/css/playerHomePages.css";
import "../pages/admin/launch.vue";

export default {
  data() {
    return {
      affichage: 0,
      question: [],
      parameters: [],

      displayResult: false,

      isQuestionDisplayed: false,
      choiceIsSubmitted: false,

      winnerID: null,
      choiceId: null,
      isPlayerChoiceWinner: false,
    };
  },
  head: {
    title: "Joueur",
  },

  beforeMount() {
    //debut de la connexion du player
    socket.emit("connection-player");
    socket.on("update-on-co-partie-playing", () => {
      this.affichage = 1;
    });
    socket.on("update-on-co-question", (questiondata) => {
      this.setWaitingMode();
      this.question = questiondata;
      this.isQuestionDisplayed = true;
    });

    socket.on("update-on-co-results", (finalChoice) => {
      this.setWaitingMode();
      this.isQuestionDisplayed = true;
      this.displayResult = true;
      this.question = finalChoice;
      this.parameters = finalChoice;
    });

    socket.on("affiche-menu", (displayStatus) => {
      this.isQuestionDisplayed = false;
      this.affichage = displayStatus;
    });

    socket.on("broadcast-question", (questiondata) => {
      this.resetAllData();
      this.setWaitingMode();

      this.question = questiondata;
      this.isQuestionDisplayed = true;
    });

    socket.on("display-final-choice", (finalChoice) => {
      this.displayResult = true;
      this.parameters = finalChoice;
    });

    socket.on("stop-partie", (displayStatus) => {
      this.isQuestionDisplayed = false;
      this.affichage = displayStatus;
    });

    socket.on("stop-question", (displayStatus) => {
      if (!this.displayResult) {
        this.resetAllData();
        this.affichage = displayStatus;
      }
      this.isQuestionDisplayed = this.displayResult;
    });

    socket.on("winnerChoice", (winner) => {
      this.winnerID = winner.id;
      this.isPlayerChoiceWinner = this.isPlayerWinner();
    });
  },
  mounted() {
    this.$root.$on("preselected-choice", (idSelected) => {
      this.choiceId = idSelected;
    });
    this.$root.$on("submitted", () => {
      this.choiceIsSubmitted = true;
    });
  },
  methods: {
    isPlayerWinner: function () {
      return this.winnerID && this.choiceId == this.winnerID;
    },
    setWaitingMode: function () {
      if (this.waitingMode) this.waitingMode = false;
    },
    resetAllData: function () {
      this.waitingMode = true;
      this.displayResult = false;

      this.parameters = [];
      this.choiceIsSubmitted = false;
      this.winnerID = null;
      this.choiceId = null;
    },
  },
};
</script>
