<template>
  <div id="orBlock">
    <div v-if="!isChoiceSubmitted">
      <button
        v-if="selectedId != null"
        @click="sendChoice()"
        class="btnSubmitChoice"
      >
        Valider mon choix
      </button>
      <p v-else>OU</p>
    </div>

    <p v-else class="confirmationSubmit">Votre réponse a bien été envoyée !</p>
  </div>
</template>

<script>
import socket from "~/plugins/socket.io.js";

export default {
  props: {
    isChoiceSubmitted: Boolean,
    choices: Array,
    selectedId: Number,
  },

  methods: {
    sendChoice: function () {
      // transmission des choix possibles et de l'id du choix fait par le player
      socket.emit("submit-choice", {
        choices: this.choices,
        playerChoice: this.selectedId,
      });

      this.$root.$emit("submitted");
    },
  },
};
</script>