<template>
  <main>
    <div id="listQuestions" class="launchContainer">
      <h1>Liste des questions</h1>
      <ul ref="questions">
        <LauncherQuestion
          v-for="(question, index) in tabQuestions"
          :key="index"
          :question="question"
          class="question"
          ref="questionInList"
        />
      </ul>
    </div>

    <ButtonContainer :isInGame="true" textBack="Mettre fin au jeu" />
  </main>
</template>


<script>
// import "@/assets/css/admin.css";
import socket from "~/plugins/socket.io.js";
import Choice from "@/assets/classes/Choice.js";
import Question from "@/assets/classes/Question.js";
import { getQuestion, getConcert } from "@/assets/classes/Admin.js";

export default {
  layout: "admin",
  head: {
    title: "Admin | Lancer le jeu",
  },

  async asyncData({ $axios, params }) {
    try {
      const id = params.concertToLaunch;
      const concert = await getConcert($axios, id);
      const questionsInConcert = [];

      // add to questions all questions contained in concert
      for (let element of concert.questions) {
        questionsInConcert.push(await getQuestion($axios, element.questionId));
      }
      return { concert, questionsInConcert };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      newQuestion: null,
      newChoice: [],
      isReload: false,
      tabQuestions: [],
    };
  },

  mounted() {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      console.info("This page is reloaded");
      (this.reload = true), socket.emit("reload-all-pages", this.isReload);
    } else {
      console.info("This page is not reloaded");
    }

    this.launchPartie();
  },

  methods: {
    // start game
    launchPartie: function () {
      this.tabQuestions = [];
      socket.emit("affichage-menu", 1);

      // get all questions in database
      this.questionsInConcert.forEach((question) => {
        // instanciate Choice objects in question
        question.choices.forEach((choice) => {
          this.newChoice.push(new Choice(choice.id, choice.title, choice.img));
        });

        // instanciate Question object
        (this.newQuestion = new Question(
          question.id,
          question.label,
          question.question,
          question.temps,
          this.newChoice
        )),
          this.tabQuestions.push(this.newQuestion);
        this.newChoice = [];
      });
    },
  },
};
</script>

<style scoped>
.launchContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>