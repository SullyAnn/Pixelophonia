<!-- Update le concert selon l'ID -->

<template>
  <div>
    <AdminHeader />
    <div class="window">
      <h2>Modifier le concert : {{ concert.concert.title }}</h2>
      <FormConcert
        type="update"
        :concert="concert"
        :allQuestions="allQuestions"
      />
      <NuxtLink to=".">Annuler (sans sauvegarder)</NuxtLink>
    </div>
  </div>
</template>

<script>
import { getConcert, getQuestions } from "@/assets/classes/Admin.js";

export default {
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
