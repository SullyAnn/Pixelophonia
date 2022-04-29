<template>
  <div>
    <AdminHeader />
    <div id="creationContainer">
      <h1>Création des questions</h1>

      <ul class="listElements creationPage">
        <li v-for="(question, index) in questions" :key="index">
          <NuxtLink :to="`./${question.id}`">
            <p>
              <b>{{ question.label }}</b>
              <br />
              <i>{{ question.question }}</i>
            </p>
          </NuxtLink>
          <div>
            <ButtonEdit :linkToEdit="`${question.id}/update`" />
            <ButtonDelete typeToDelete="question" :idToDelete="question.id" />
          </div>
        </li>
      </ul>
    </div>
    <ButtonAdd />
    <ButtonReturn linkBack="../" />
  </div>
</template>

<script>
import { getQuestions } from "@/assets/classes/Admin.js";
export default {
  name: "QuestionList",

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