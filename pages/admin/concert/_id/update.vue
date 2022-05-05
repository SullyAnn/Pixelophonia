<template>
  <main>
    <div class="window">
      <h2>Modifier le concert : {{ concert.concert.title }}</h2>
      <FormConcert
        type="update"
        :concert="concert"
        :allQuestions="allQuestions"
      />
      <NuxtLink to=".">Annuler (sans sauvegarder)</NuxtLink>
    </div>
  </main>
</template>

<script>
import { getConcert, getQuestions } from "@/assets/classes/Admin.js";

export default {
  layout:"admin",
  async asyncData({ params, $axios }) {
    const id = params.id;

    try {
      const concert = await getConcert($axios, id);
      const allQuestions = await getQuestions($axios);

      return { concert, allQuestions };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
