<template>
  <form @submit.prevent="handleSubmit">
    <input
      type="text"
      v-model="title"
      placeholder="Titre du concert"
      class="labelChoice"
    />

    <h3>Questions à inclure au concert</h3>
    <div class="allQuestionsToCheck">
      <div
        v-for="(question, index) in allQuestions"
        :key="index"
        class="containsCheckQuestion"
      >
        <input
          type="checkbox"
          :id="`question_${question.id}`"
          class="checkQuestion"
        />
        <label :for="`question_${question.id}`">{{ question.label }}</label>
      </div>
    </div>
    <input type="submit" value="ok" class="btn send" />
  </form>
</template>

<script>
import { updateConcert, addConcert } from "@/assets/classes/Admin.js";

export default {
  data() {
    return {
      // form d'ajout
      title: "",
      questionsInConcert: [],
    };
  },

  props: {
    type: String,
    concert: null,
    allQuestions: [],
  },

  mounted() {
    if (this.type == "update") {
      this.id = this.concert.concert.id;
      this.questionsInConcert = this.concert.questions;
      this.title = this.concert.concert.title;
      this.verifCheck();
    }
  },

  methods: {
    verifCheck: function () {
      console.log(this.allQuestions);
      this.allQuestions.forEach((element) => {
        for (let elem of this.concert.questions) {
          if (elem.questionId == element.id) {
            document.getElementById("question_" + element.id).checked = true;
          }
        }
      });
    },

    handleSubmit: async function (e) {
      e.preventDefault();
      let tabCheckedQuestions = [];

      this.allQuestions.forEach((element) => {
        if (document.getElementById("question_" + element.id).checked) {
          tabCheckedQuestions.push(element);
        }
      });

      const body = {
        title: this.title,
        questions: tabCheckedQuestions,
      };

      if (this.type == "update") {
        await updateConcert(this.$axios, this.concert.concert.id, body);
        this.$router.push(".");
      } else if (this.type == "add") {
        await addConcert(this.$axios, body);
        this.$router.push("./");
      }
    },
  },
};
</script>

<style scoped>
</style>