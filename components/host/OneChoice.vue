<template>
  <div class="chatArea" :id="'halfChoiceContainer' + idChoice">
    <h1>{{ data.title }}</h1>
    <img
      :id="idChoice"
      :src="require(`assets/images/Question_${idQuestion}/` + data.img)"
      alt="image test"
      class="images"
    />
    <div class="directResultMove" v-show="displayResult"></div>
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
  },
  data() {
    return {
      timeToDisplay: false,
    };
  },
  methods: {
    isWinner: function (idWinner) {
      if (idWinner == this.idChoice) return 1;
      else return 0;
    },

    animationChoice: function (valueWinner) {
      let elementChoice = document.getElementById(
        "halfChoiceContainer" + this.idChoice
      );

      // valueWinner = 1 si gagnant ; 0 sinon
      if (window.innerWidth > 768) {
        elementChoice.style.width = valueWinner * 100 + "%";
      } else {
        elementChoice.style.height = valueWinner * 100 + "%";
      }
    },
  },

  mounted() {
    socket.on("display-final-choice", (finalChoice) => {
      let idWinner = finalChoice.winnerChoice.id;
      this.animationChoice(this.isWinner(idWinner));
      this.$root.$emit("display-result", finalChoice);
    });
  },
};
</script>