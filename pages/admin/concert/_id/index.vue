<!-- Voir le concert selon l'ID -->
<template>
  <main>
    <div id="seeConcert">
      <h1>Voir le concert</h1>
      <h2>{{ concert.concert.title }}</h2>
      <h3>Questions du concert</h3>
      <ListContainer
        :datas="questions"
        type="question"
        preLink="../question/"
        :displayButtons="false"
      />
    </div>

    <ButtonContainer
      :isReturn="true"
      linkBack="./"
      :isEdit="true"
      :linkEdit="concert.concert.id + '/update'"
    />
  </main>
</template>

<script>
import { getConcert, getQuestion } from "@/assets/classes/Admin.js";

export default {
  layout: "admin",
  async asyncData({ params, $axios }) {
    const id = params.id;
    try {
      const concert = await getConcert($axios, id);
      const questions = [];

      for (let element of concert.questions) {
        questions.push(await getQuestion($axios, element.questionId));
      }
      return { concert, questions };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style>
#seeConcert {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  height: 75vh;
}
#seeConcert a {
  display: flex;
  align-items: center;
}
</style>

