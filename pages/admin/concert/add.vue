<!-- Ajouter un concert -->

<template>
  <div>
    <AdminHeader />
    <div class="window">
      <h2>Créer un concert</h2>
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
            v-for="(question, index) in questions"
            :key="index"
            class="containsCheckQuestion"
          >
            <input type="checkbox" :id="question.id" class="checkQuestion" />
            <label :for="question.id">{{ question.label }}</label>
          </div>
        </div>
        <input type="submit" value="ok" class="btn send" />
      </form>
      <NuxtLink to="./">Revenir à la liste (sans sauvegarder)</NuxtLink>
    </div>
  </div>
</template>

<script>
import { getQuestions, addConcert } from "@/assets/classes/Admin.js";
import "@/assets/css/admin.css";

export default {
  name: "Concerts",
  async asyncData({ $axios }) {
    try {
      const questions = await getQuestions($axios);

      return { questions };
    } catch (error) {
      console.log(error);
    }
  },

  data() {
    return {
      // afficher la liste des concerts
      listOfConcerts: [],

      // form d'ajout
      title: "",
      questions: [],
    };
  },

  beforeMount() {},

  methods: {
    handleSubmit: async function (e) {
      e.preventDefault();
      let tabCheckedQuestions = [];

      this.questions.forEach((element) => {
        if (document.getElementById(element.id).checked == true) {
          tabCheckedQuestions.push(element);
        }
      });

      const body = {
        title: this.title,
        questions: tabCheckedQuestions,
      };
      const concerts = await addConcert(this.$axios, body);
      this.$router.push("./");
    },
  },
};
</script>