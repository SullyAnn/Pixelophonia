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
            :votesTotal="votesData.total"
            :votesChoice="votesData['choice'+ parseFloat(index + 1)]"
          />

          <div class="infoContainer">
            <h2 class="question">{{ question.question }}</h2>
            <ElementTimer v-if="timeParams.showTimer" :totalTime="timeParams.total * 1000" />
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
      votesData: { total: 0, choice1: 0, choice2: 0 },

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
      this.votesData = { total: 0, choice1: 0, choice2: 0 };
    },
  },
};
</script>