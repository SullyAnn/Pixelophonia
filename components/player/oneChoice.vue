<template>
  <!-- v-for="(data, index) in question.choices" -->
  <div class="choice" @click="selectChoice()" ref="choiceSelection">
    <h1>{{ choiceData.title }}</h1>
    {{ idChoice }}
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
    isAChoiceSubmitted() {
      // change cursor
      document.getElementById("choice" + this.idChoice).style.cursor = "auto";
    },
  },

  mounted() {
    this.$root.$on("preselected-choice", (idSelected) => {
      let element = document.getElementById("choice" + this.idChoice);
      if (idSelected != this.idChoice) {
        this.discardChoice(element);
        this.lightFilter(element, 0.6);
      } else {
        this.keepChoice(element);
        this.lightFilter(element, 1.25);
      }
    });
  },
  methods: {
    keepChoice: function (element) {
      element.classList.remove("discarded");
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