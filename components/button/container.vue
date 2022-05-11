<template>
  <section class="container">
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
  </section>
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
.container {
  background-color: rgb(206, 217, 252);
  padding: 0 30px;
  margin-top: 30px;
}

#allButtons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#creationButtons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px;
}
p {
  text-align: center;
}

@media screen and (max-height: 768px) {
  .container {
    margin-top: 5px;
  }
}

</style>