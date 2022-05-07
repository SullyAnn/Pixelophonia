<template>
  <div id="orBlock" v-if="!isChoiceSubmitted">
    <button
      v-if="selectedId != null"
      @click="sendChoice()"
      class="btnSubmitChoice"
    >
      Valider mon choix
    </button>
    <p class="orText" v-else>OU</p>
  </div>

  <div id="orBlock" v-else>
    <p class="confirmationSubmit">Votre réponse a bien été envoyée !</p>
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

<style scoped>
#orBlock {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
#orBlock * {
  text-align: center;
  transition: 0.3s ease-in-out;
  border-radius: 16px;
  padding: 12px 24px;
  font-size: 1.25rem;
  text-align: center;
}

.orText {
  /* font-weight: bold; */
  color: #37263e;
  background-color: rgba(255, 255, 255, 1);
}

.btnSubmitChoice {
  border: none;
  padding: 16px 24px;
  border-radius: 8px;
  color: #fff;
  background-color: #37263e;
}

.btnSubmitChoice:hover {
  cursor: pointer;
  background-color: #53455a;
}

.confirmationSubmit {
  background-color: #0cb4ce;
  color: #fff;
}
</style>