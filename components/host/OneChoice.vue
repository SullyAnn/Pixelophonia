<template>
  <div class="chatArea" :id="'halfChoiceContainer' + idChoice">
    <h1>{{ data.title }}</h1>
    <img
      :id="idChoice"
      :src="require(`assets/images/Question_${idQuestion}/` + data.img)"
      alt="image test"
      class="images"
    />
    <div
      class="directResultMove"
      :id="'directResultMove' + idChoice"
      v-if="displayResult"
    ></div>
  </div>
</template>

<script>
import socket from "~/plugins/socket.io.js";

export default {
  props: {
    idChoice: Number,
    idQuestion: Number,
    data: Object,
    displayResult: Boolean,
    votesTotal: Number,
    votesChoice: Number,
  },
  data() {
    return {
      nouvelIdentifiant: null,
      timeToDisplay: false,
      elementChoice: null,
    };
  },
  beforeDestroy() {
    this.nouvelIdentifiant = null;
    this.timeToDisplay = false;
    this.elementChoice = null;
  },

  watch: {
    votesTotal: function () {
      this.animationVotes();
    },
  },

  mounted() {
    socket.on("display-final-choice", (finalChoice) => {
      this.nouvelIdentifiant = this.idChoice;
      this.elementChoice = document.getElementById(
        "halfChoiceContainer" + this.nouvelIdentifiant
      );
      if (this.elementChoice) {
        let idWinner = finalChoice.winnerChoice.id;
        this.$nextTick(() => {
          this.animationChoice(this.isWinner(idWinner));
          this.$root.$emit("display-result", finalChoice);

          this.nouvelIdentifiant = null;
          this.timeToDisplay = false;
          this.elementChoice = null;
        });
      }
    });
  },

  methods: {
    isWinner: function (idWinner) {
      if (idWinner == this.nouvelIdentifiant) return 1;
      else return 0;
    },

    animationChoice: function (valueWinner) {
      // valueWinner = 1 si gagnant ; 0 sinon
      if (window.innerWidth > 768) {
        this.elementChoice.style.width = valueWinner * 100 + "%";
      } else {
        this.elementChoice.style.height = valueWinner * 100 + "%";
      }
    },

    // change directVotes style
    calculateHeightVotes: function (nbVotes, totalVotes) {
      document.getElementById("directResultMove" + this.idChoice).style.height =
        (nbVotes / totalVotes) * 100 + "%";
    },

    // direct votes animation
    animationVotes: function () {
      if (this.displayResult) {
        this.calculateHeightVotes(this.votesChoice, this.votesTotal);
      }
    },
  },
};
</script>