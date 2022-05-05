<template>
  <div class="timerWrapper">
    <div id="timeProgress" ref="timeProgress"></div>
  </div>
</template>

<script>
export default {
  props: {
    totalTime: Number,
  },
  data() {
    return {
      startTime: null,
      progressBar: null,
    };
  },

  mounted() {
    this.startTime = Date.now();
    this.progressBar = document.getElementById("timeProgress");

    let test = setInterval(() => {
      const elapsedTime = this.getElapsedTime();
      if (elapsedTime <= this.totalTime) {
        this.changeBarStyle(elapsedTime);
      }
    }, 10);

    this.$root.$on("stop-timer", () => {
      clearInterval(test);
    });
  },
  
  methods: {
    getElapsedTime: function () {
      return Date.now() - this.startTime;
    },
    changeBarStyle: function (elapsed) {
      // longueur
      this.progressBar.style.width =
        "calc(8px + (" + elapsed / this.totalTime + " * (100% - 8px)))";
      //changement de couleur
      if ((elapsed / this.totalTime) * 100 > 75) {
        this.progressBar.style.backgroundColor = "#CA4B4B";
      }
    },
  },
};
</script>
<style scoped>
/* ==== Timer ==== */

.timerWrapper {
  width: 100%;
  height: 16px;
  background-color: #d2d2d2;
  border-radius: 50px;
  position: relative;
}

#timeProgress {
  width: 0;
  height: 100%;
  background-color: #0cb4ce;
  border-radius: 50px;
}
</style>