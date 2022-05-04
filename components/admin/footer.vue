<template>
  <footer>
    <div id="allButtons">
      <ButtonReturn
        v-if="isInGame"
        :isInGame="isInGame"
        :text="textBack"
        @click.native="stopPartie()"
        id="retour"
      />
      <ButtonReturn v-else-if="isReturn" :linkBack="linkBack" id="retour" />
      <div id="creationButtons">
        <ButtonAdd v-if="isAdd" :link="linkAdd" />
        <ButtonEdit v-if="isEdit" :linkToEdit="linkEdit" />
      </div>
    </div>
    <p>Pixelophonia - tous droits réservés</p>
  </footer>
</template>

<script>
import socket from "~/plugins/socket.io.js";

export default {
  props: {
    textBack: {
      type: String,
      default: "retour",
    },
    linkBack: {
      type: String,
      default: null,
    },
    linkAdd: {
      type: String,
      default: null,
    },
    linkEdit: {
      type: String,
      default: null,
    },
    isInGame: {
      type: Boolean,
      default: false,
    },
    isReturn: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    stopPartie: function () {
      if (this.isInGame) {
        socket.emit("stop-partie", 2);
        this.$router.push("../launch");
      }
    },
  },
};
</script>

<style scoped>
footer {
  background-color: rgb(206, 217, 252);

  padding: 0 30px;
  width: 100%;
  bottom: 0;
  position: fixed;
}
#allButtons {
  display: flex;
  flex-flow: row;
  width: 100%;
  justify-content: space-between;
}

#creationButtons {
  display: flex;
  justify-content: space-evenly;
  width: 50%;
}
p {
  text-align: center;
}
</style>