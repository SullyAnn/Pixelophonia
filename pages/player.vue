<template>
  <main>
    <div v-if="question" v-show="isQuestionDisplayed" id="choicePageContent">
      <div v-if="!displayResult" class="container">
        <PlayerOrBlock
          :isChoiceSubmitted="choiceIsSubmitted"
          :choices="question.choices"
          :selectedId="choiceId"
        />

        <PlayerOneChoice
          class="choice"
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
        :destination="parameters.winnerChoice.title"
      />
    </div>

    <PlayerHomePage v-show="!isQuestionDisplayed" :affichage="affichage" />
  </main>
</template>

<script>
import socket from "~/plugins/socket.io.js";

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

<style scoped>
main {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

#choicePageContent {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;

}

.choice {
  display: flex;
  width: 50vw;
}

.choice:nth-child(2) {
  align-items: flex-start;
  justify-content: flex-start;
}

.choice:nth-child(3) {
  align-items: flex-end;
  justify-content: flex-end;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media screen and (min-width: 768px) {
  #choicePageContent {
    flex-direction: row;
  }
  .container {
    flex-direction: row;
  }
}
</style>