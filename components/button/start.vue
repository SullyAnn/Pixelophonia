<template>
  <button :id="index + 1" @click="switchClass(index + 1)" class="btn start">
    <svg
      style="display: block"
      class="svg-icon"
      viewBox="0 0 1025 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1024 512l-804.0448 512L219.9552 0 1024 512z" />
    </svg>
    <svg
      style="display: none"
      class="svg-icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0l1024 0 0 1024L0 1024 0 0z" />
    </svg>
  </button>
</template>

<script>
export default {
  props: {
    index: Number,
  },
  methods: {
    // switch square & triangle (start/stop buttons)
    switchSVG: function (idToChange) {
      let toChange = document.getElementById(idToChange);
      Array.from(toChange.getElementsByTagName("svg")).forEach((element) => {
        if (element.style.display == "block") element.style.display = "none";
        else element.style.display = "block";
      });
    },

    // switch green & red (start/stop buttons)
    switchColor: function (idToChange) {
      let buttonsList = document
        .getElementById("listQuestions")
        .getElementsByClassName("btn");
      let btnToChange = document.getElementById(idToChange);

      if (btnToChange.classList.contains("start")) {
        // set all buttons to disabled
        Array.from(buttonsList).forEach(function (element) {
          element.classList.remove("start");
          element.classList.add("cantSelect");
          element.disabled = true;
        });

        // set the selected button to 'enabled'
        btnToChange.classList.remove("cantSelect");
        btnToChange.classList.add("stop");
        btnToChange.disabled = false;
      } else {
        Array.from(buttonsList).forEach(function (element) {
          element.classList.remove("cantSelect", "stop");
          element.classList.add("start");
          element.disabled = false;
        });
      }
    },

    // switch start & stop buttons
    switchClass: function (idToChange) {
      this.switchSVG(idToChange);
      this.switchColor(idToChange);
    },
  },
};
</script>

<style scoped>
.start {
  background: #6cad56;
}
.stop {
    background: #aa1b1b;
}
.cantSelect {
    background: #929292;
}

</style>