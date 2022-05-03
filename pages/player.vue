<template>
  <section>
    <div v-show="isQuestionDisplayed" id="choicePageContent">
      <div v-if="!displayResult" class="container">
        <div id="orBlock">
          <div v-if="!choiceIsSubmitted">
            <button
              v-if="selectedChoiceId != -1"
              v-on:click="sendChoice(selectedChoiceId)"
              class="btnSubmitChoice"
            >
              Valider mon choix
            </button>
            <p v-else>OU</p>
          </div>

          <p v-else class="confirmationSubmit">
            Votre réponse a bien été envoyée !
          </p>
        </div>

        <div
          v-for="(data, index) in choices"
          :key="index"
          class="choice"
          v-on:click="selectChoice(index)"
          ref="choiceSelection"
        >
          <h1>{{ data.title }}</h1>
          <img
            :id="index"
            :src="require(`assets/images/Question_${idQuestion}/` + data.img)"
            alt="image test"
          />
        </div>
      </div>

      <div id="resultSection" v-else>
        <div class="resultMessage">
          <p class="resultText" v-if="!choiceIsSubmitted">test</p>

          <p class="resultText" v-else-if="choiceId == winnerID">
            Bien joué voyageur ! Nous nous dirigeons vers la direction souhaitée.
          </p>

          <p class="resultText" v-else>
            Pas de chance ! nous empruntons l'autre chemin.
          </p>
        </div>

        <img
          :src="
            require(`assets/images/Question_${idQuestion}/` +
              this.parameters.winnerChoice.img)
          "
          alt="image test"
        />
      </div>
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
  asyncData() {
    return new Promise((resolve) => {
      socket.emit("last-choices", (choices) => resolve({ choices }));
    });
  },
  data() {
    // PARTIE STATUS = AFFICHAGE
    /*
        0 : pas de partie en cours
        1 : partie en cours, pas de question
        2 : question en cours - Votes
        3 : question en cours - résultat
    */

    return {
      idQuestion: null,
      winner: {},
      percentage: 0,
      parameters: [],
      displayResult: false, //si c'est true c'est qu'on montre les réponses et pas la question
      IsChoice1Disabled: true,
      isQuestionDisplayed: false,
      affichage: 0,
      selectedChoiceId: -1,
      choiceIsSubmitted: false,
      winnerID: -1,
      choiceId: -1,
      keepChoiceIdInMemory: -1,
    };
  },
  head: {
    title: "Joueur",
  },
  watch: {},
  beforeMount() {
    //debut de la connexion du player
    socket.emit("connection-player");
    socket.on("update-on-co-partie-playing", () => {
      this.affichage = 1;
    });
    socket.on("update-on-co-question", (questiondata) => {
      //display question
      if (this.waitingMode) this.waitingMode = false;

      this.choices = [];
      this.idQuestion = questiondata.id;
      this.choices = Object.values(questiondata.choices);
      this.isQuestionDisplayed = true;
      //----------------
    });

    socket.on(
      "update-on-co-results",
      (totalvotes, winner, percentage, egalite, idQuestion) => {
        if (this.waitingMode) {
          this.waitingMode = false;
        }
        this.isQuestionDisplayed = true;
        this.idQuestion = idQuestion;
        this.displayResult = true;
        this.parameters = [];
        this.parameters.push({
          totalvote: totalvotes,
          winner: winner.img,
          percentage: Math.floor(percentage) + "%",
        });
      }
    );

    socket.on("affiche-menu", (displayStatus) => {
      this.isQuestionDisplayed = false;
      this.affichage = displayStatus;
    });

    socket.on("broadcast-question", (questiondata) => {
      this.resetAllData();
      if (this.waitingMode) {
        this.waitingMode = false;
      } //comme on a lancé une question on est plus en waitingMode
      this.choices = [];
      this.idQuestion = questiondata.id;
      this.choices = Object.values(questiondata.choices);
      this.isQuestionDisplayed = true;
    });

    socket.on("display-player-choice", (choice) => {
      // on empêche le player de changer de vote (ça bloque les événements sur le click)
      this.IsChoice1Disabled = false;
      // effet grisé une fois une image sélectionnée
      if (choice.yourchoice == 0) {
        document.getElementById("1").style.filter =
          "grayscale(1) brightness(0.6)";
        document.getElementById("0").style.filter = "brightness(1.25)";
      } else if (choice.yourchoice == 1) {
        document.getElementById("0").style.filter =
          "grayscale(1) brightness(0.6)";
        document.getElementById("1").style.filter = "brightness(1.25)";
      }
    });

    // totalVotes, winnerChoice, percentage, isEgalite
    socket.on(
      "display-final-choice",
      (finalChoice) => {
        this.displayResult = true;
        this.parameters = finalChoice;
        console.log(this.parameters)
      }
    );

    socket.on("stop-partie", (displayStatus) => {
      this.isQuestionDisplayed = false;
      this.affichage = displayStatus;
    });

    socket.on("stop-question", (displayStatus) => {
      if (!this.displayResult) {
        this.resetAllData();
        this.isQuestionDisplayed = false;
        this.affichage = displayStatus;
      } else {
        this.isQuestionDisplayed = true;
      }
    });

    socket.on("winnerChoice", (winner) => {
      this.winnerID = winner.id;
    });
  },
  methods: {
    sendChoice: function (idChoice) {
      if (!this.IsChoice1Disabled) {
        return;
      } // trouver une meilleure solution pour désactiver event click sur les images
      //const idPlayerChoice = Object.values(this.choices).at(idChoice).id
      const idPlayerChoice = Object.values(this.choices)[idChoice].id;

      this.choiceId = idPlayerChoice;

      this.choices.find((element) => element.id == idPlayerChoice).nbvotes++;

      // transmission des choix possibles et de l'id du choix fait par le player
      socket.emit("submit-choice", {
        choices: this.choices,
        playerChoice: idChoice,
      });

      //on reinitialise le choix
      this.selectedChoiceId = -1;
      this.choiceIsSubmitted = true;

      //on enlève le pointer hover
      this.$refs["choiceSelection"][0].style.cursor = "auto";
      this.$refs["choiceSelection"][1].style.cursor = "auto";
    },
    selectChoice: function (index) {
      if (!this.choiceIsSubmitted) {
        //on vérifie qu'on a pas déjà envoyé une réponse
        if (this.selectedChoiceId == index) {
          //le choix est déjà sélectionné, donc on le désélectionne
          this.selectedChoiceId = -1;
          this.keepChoiceIdInMemory = -1;
          this.$refs["choiceSelection"][0]
            .querySelector("img")
            .classList.remove("discarded");
          this.$refs["choiceSelection"][1]
            .querySelector("img")
            .classList.remove("discarded");
        } else {
          //sinon on sélectionne le choix
          this.selectedChoiceId = index;
          if (index == 0) {
            this.$refs["choiceSelection"][1]
              .querySelector("img")
              .classList.add("discarded");
            this.$refs["choiceSelection"][0]
              .querySelector("img")
              .classList.remove("discarded");
          } else if (index == 1) {
            this.$refs["choiceSelection"][0]
              .querySelector("img")
              .classList.add("discarded");
            this.$refs["choiceSelection"][1]
              .querySelector("img")
              .classList.remove("discarded");
          }
        }
      }
    },
    resetAllData: function () {
      this.waitingMode = true;
      this.displayResult = false;

      this.choices = [];
      this.idQuestion = null;
      this.IsChoice1Disabled = true;
      this.displayResult = false;

      this.winner = {};
      this.percentage = 0;
      this.parameters = [];
      this.selectedChoiceId = -1;
      this.choiceIsSubmitted = false;
      this.winnerID = -1;
      this.choiceId = -1;
      this.keepChoiceIdInMemory = -1;
    },
  },
};
</script>
