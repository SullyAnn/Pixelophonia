<template>
  <footer>
    <ButtonReturn
      v-if="isInGame"
      :isInGame="isInGame"
      :text="textBack"
      @click.native="stopPartie()"
    />
    <ButtonReturn v-else-if="isReturn" :linkBack="linkBack" />
    <ButtonAdd v-if="isAdd" :link="linkAdd" />
    <ButtonEdit v-if="isEdit" :linkToEdit="linkEdit" />
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
</style>