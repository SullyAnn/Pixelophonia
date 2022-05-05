<template>
  <main>
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
    <ButtonContainer
      :isReturn="true"
      linkBack="../"
      :isAdd="true"
      linkAdd="./add"
    />
  </main>
</template>

<script>
import { getQuestions } from "@/assets/classes/Admin.js";
export default {
  layout: "admin", 
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