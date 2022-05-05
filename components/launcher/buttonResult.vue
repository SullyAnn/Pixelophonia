<template>
  <button
    v-if="!launchedResults"
    tabindex="1"
    @click="launchResult()"
    class="btnLaunchResults"
  >
    <p>Lancer les résultats</p>
  </button>
  <p v-else class="launched">Résultats affichés.</p>
</template>
<script>
import socket from "~/plugins/socket.io.js";

export default {
  data() {
    return {
      launchedResults: false,
    };
  },
  methods: {
    launchResult: function () {
      this.launchedResults = true;
      socket.emit("calcul-resultat");
    },
  },
};
</script>

<style scoped>
.btnLaunchResults,
.launched {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 11px;
  transition: 0.3s ease;
  color: #fff;
}
.btnLaunchResults {
  background-color: #37263e;
}

.btnLaunchResults:hover {
  cursor: pointer;
  background-color: #53455a;
}

p  {
  margin: 5px;
  text-align: left;
}

.btnLaunchResults:focus {
  background: green;
}

.littleIcon {
  width: 25px;
  height: 25px;
  transition: 0.3s ease-in-out;
}

.launched {
  background: green;
  width: 100%;
}
</style>