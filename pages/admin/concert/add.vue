<!-- Ajouter un concert -->

<template>
  <main>
    <div class="window">
      <h2>Créer un concert</h2>
      <FormConcert type="add" :allQuestions="questions" />
      <NuxtLink to="./">Revenir à la liste (sans sauvegarder)</NuxtLink>
    </div>
  </main>
</template>

<script>
import { getQuestions } from "@/assets/classes/Admin.js";
import "@/assets/css/admin.css";

export default {
  name: "Concerts",
  layout:"admin", 
  async asyncData({ $axios }) {
    try {
      const questions = await getQuestions($axios);
      return { questions };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>