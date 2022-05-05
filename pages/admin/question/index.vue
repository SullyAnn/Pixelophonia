<template>
  <main>
    <div class="launchContainer">
      <h1>Création des questions</h1>
      <ListContainer type="question" :datas="questions" preLink="./" />
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