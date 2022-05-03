<template>
  <section id="hostSection">
    <HostWaiting v-if="waitingMode" />

    <div v-else class="questionSection">
      <div v-if="!displayResult">
        <!-- nombre de votes courants sur la question -->
        <ElementVotes :totalVotes="votesData.total" />
        <!---->

        <div id="parent" class="displayed">
          <HostOneChoice
            v-for="(data, index) in question.choices"
            :key="index"
            :idChoice="question.choices[index].id"
            :idQuestion="question.id"
            :data="data"
            :displayResult="displayDirectResults"
          />

          <div class="infoContainer">
            <h2 class="question">{{ question.question }}</h2>
            <ElementTimer v-if="timeParams.showTimer" />
            <ElementSpinner v-else />
          </div>
        </div>
      </div>
      <HostResults :data="finalChoice" :idQuestion="question.id" v-else />
      <img src="../assets/images/qrCode.png" class="qrCodeQuestion" />
    </div>
  </section>
</template>

<script>
import socket from "~/plugins/socket.io.js";
import "../assets/css/host.css";

export default {
  data() {
    return {
      finalChoice: null,
      votesData: { total: 0, votesChoice1: 0, votesChoice2: 0 },

      waitingMode: true,
      displayResult: false,

      timeParams: [],
      displayDirectResults: false,

      question: [],
    };
  },
  head: {
    title: "Ecran de la salle",
  },
  watch: {},
  beforeMount() {
    // connexion du host
    socket.emit("connection-host");

    // ====================== RELOAD DE PAGE ====================== //

    // actualiser la page alors qu'il y a la question
    socket.on(
      "update-host-on-co-question",
      (questiondata, votesInfos, updateTimer) => {
        this.setWaitingMode();
        this.question = questiondata;
        this.votesData = votesInfos;

        //si on a bien un temps à afficher
        if (updateTimer.showTimer) {
          this.timeParams.showTimer = true;
          this.afficheTimer(updateTimer.start, updateTimer.total);
        }
        this.displayDirectResults = votesInfos.displayDirectResults;
      }
    );

    // actualiser la page alors qu'il y a les résultats
    socket.on("update-host-on-co-results", (finalChoice) => {
      this.setWaitingMode();

      this.displayResult = true;
      this.question.id = finalChoice.idQuestion;
      this.finalChoice = finalChoice;
    });

    // Tout reload quand admin reload
    socket.on("reload-this-page", () => {
      location.reload(true);
    });

    // ========================== ARRET =========================== //

    // arrêt de la partie (quit page)
    socket.on("stop-partie", () => {
      this.resetAllData();
    });

    // arrêt de la question (stop button)
    socket.on("stop-question", () => {
      if (!this.displayResult) this.resetAllData();
      else this.waitingMode = this.setWaitingMode();
    });
    // ======================== AFFICHAGE ========================= //

    // paramètres d'affichage & temps de la question
    socket.on("display-question-on-screen", (timeParams, showResults) => {
      this.setWaitingMode();

      this.displayDirectResults = showResults;
      this.timeParams = timeParams;
      this.afficheTimer(timeParams.start, timeParams.total);
    });

    // datas de la question
    socket.on("broadcast-question", (questiondata) => {
      this.resetAllData();
      this.question = questiondata;
    });
  },

  mounted() {
    // affiche les votes
    socket.on("augmentation-nb-votes", (votesInfos) => {
      this.votesData = votesInfos;
      this.animationVotes();
    });

    // résultats
    this.$root.$on("display-result", (finalChoice) => {
      setTimeout(
        function () {
          this.displayResult = true;
        }.bind(this),
        1500
      );
      this.finalChoice = finalChoice;
    });
  },

  methods: {
    setWaitingMode: function () {
      if (this.waitingMode) this.waitingMode = false;
    },

    resetAllData: function () {
      // divs to display
      this.waitingMode = true;
      this.displayResult = false;
      this.displayDirectResults = false;

      // parameters
      this.timeParams = null;
      this.finalChoice = null;
      this.votesData = { total: 0, votesChoice1: 0, votesChoice2: 0 };
    },

    // ======================== ANIMATION ========================= //

    // change directVotes style
    calculateHeightVotes: function (idChoice, nbVotes, totalVotes) {
      document
        .getElementById("halfChoiceContainer" + idChoice)
        .querySelector(".directResultMove").style.height =
        (nbVotes / totalVotes) * 100 + "%";
    },

    // direct votes animation
    animationVotes: function () {
      if (!this.displayResult && this.displayDirectResults) {
        this.calculateHeightVotes(
          this.question.choices[0].id,
          this.votesData.choice1,
          this.votesData.total
        );
        this.calculateHeightVotes(
          this.question.choices[1].id,
          this.votesData.choice2,
          this.votesData.total
        );
      }
    },

    // change style timer
    changeStyle: function (element, elapsedTime, duration) {
      element.style.width =
        "calc(16px + (" + elapsedTime / duration + " * (100% - 16px)))";

      if ((elapsedTime / duration) * 100 > 75) {
        element.style.backgroundColor = "#CA4B4B";
      }
    },

    // timer animation
    afficheTimer: async function (startTime, duration) {
      const durationMs = duration * 1000;

      let myTimer = setInterval(() => {
        if (!this.waitingMode) {
          let currentTime = Date.now();
          let progressBar = document.getElementById("timeProgress");

          let elapsedTime = currentTime - startTime; //en millisecondes
          if (elapsedTime <= durationMs)
            this.changeStyle(progressBar, elapsedTime, durationMs);
          else clearInterval(myTimer);
        } else {
          //si on arrête la question avant la fin
          clearInterval(myTimer);
        }
      }, 10);
    },
  },
};
</script>