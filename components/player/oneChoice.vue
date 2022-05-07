<template>
  <!-- v-for="(data, index) in question.choices" -->
  <div @click="selectChoice()" ref="choiceSelection">
    <h1>{{ choiceData.title }}</h1>
    <img
      :id="'choice' + idChoice"
      :src="require(`assets/images/Question_${idQuestion}/` + choiceData.img)"
      alt="image test"
    />
  </div>
</template>

<script>
export default {
  props: {
    choiceData: Object,
    idChoice: Number,
    idQuestion: Number,
    isAChoiceSubmitted: Boolean,
  },

  watch: {
    isAChoiceSubmitted: function () {
      // change cursor
      document.getElementById("choice" + this.idChoice).style.cursor = "auto";
    },
  },

  mounted() {
    this.$root.$on("preselected-choice", (idSelected) => {
      let element = document.getElementById("choice" + this.idChoice);
      if (element) {
        if (idSelected != this.idChoice) {
          this.discardChoice(element);
          this.lightFilter(element, 0.6);
        } else {
          this.keepChoice(element);
          this.lightFilter(element, 1.25);
        }
      }
    });
  },
  methods: {
    keepChoice: function (element) {
      console.log("keep", element);

      if (element) {
        this.$nextTick(() => {
          element.classList.remove("discarded");
        });
      }
    },

    discardChoice: function (element) {
      element.classList.add("discarded");
    },

    lightFilter: function (element, value) {
      element.style.filter = "brightness(" + value + ")";
    },

    selectChoice: function () {
      if (!this.isAChoiceSubmitted) {
        this.$root.$emit("preselected-choice", this.idChoice);
      }
    },
  },
};
</script>

<style scoped>
div {
  height: 50%;
  display: flex;
  color: white;
  transition: 0.2s ease;
  position: relative;
}

div:hover {
  cursor: pointer;
}

div .discarded {
  filter: brightness(0.6);
}

img {
  height: 100%;
  z-index: 7;
  transition-duration: 0.4s;
  -webkit-transition-duration: 0.4s;
  object-fit: cover;
      width: 100%;
    height: 100vh;
    object-fit: cover;

}
h1 {
  font-size: 1rem;
  padding: 12px 32px;
  margin: 24px;
  font-weight: bold;
  background-color: rgba(64, 70, 89, 0.8);
  color: #fff;
  border-radius: 8px;
  text-transform: uppercase;
  position: absolute;
  z-index: 8;
}

@media screen and (min-width: 768px) {
  .choice {
    height: 100%;
    width: 50%;
  }
}
</style>