<!-- Voir le concert selon l'ID -->
<template>
  <div>
    <AdminHeader />
    <div id="seeConcert">
      <h1>Voir le concert</h1>
      <h2>{{ concert.concert.title }}</h2>
      <h3>Questions du concert</h3>
      <ul class="questionsContainer">
        <li
          class="oneQuestion"
          v-for="(question, index) in questions"
          :key="index"
        >
          <p class="elementViewConcert">
            <b>{{ question.label }}</b> <br />
            <i>{{ question.question }}</i>
          </p>
        </li>
      </ul>
    </div>

    <ButtonEdit
      :linkToEdit="`${concert.concert.id}/update`"
      text="Modifier le concert"
    />

    <ButtonReturn linkBack="./" />

  </div>
</template>

<script>
import { getConcert, getQuestion } from "@/assets/classes/Admin.js";

export default {
  async asyncData({ params, $axios }) {
    const id = params.id; // get the id of the concert
    try {
      const concert = await getConcert($axios, id);
      const questions = [];

      for (let element of concert.questions) {
        // add to questions all questions contained in concert
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

