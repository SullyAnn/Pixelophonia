<template>
  <div>
    <AdminHeader />
    <div id="creationContainer">
      <h1>Création des questions</h1>

      <ul class="listElements creationPage">
        <QuestionInList
          v-for="(question, index) in questions"
          :key="index"
          :question="question"
          :link="'./' + question.id"
        />
      </ul>
    </div>
    <ButtonAdd link= "./add" />
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