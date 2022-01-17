<template>
  <div>
    <h1>Création concert</h1>
    
      <ul>
        <li v-for="(question, index) in questions" :key="index">
          <i>{{ question.label }} ;</i> {{ question.question }}
          <NuxtLink :to="`${question.id}`">Modifier {{question.id}}</NuxtLink>
          <button v-on:click="deleteAQuestion(question.id)" >Supprimer</button>
        </li>
      </ul>

      <NuxtLink to="./AjoutQuestion">Ajouter une question</NuxtLink>

  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import {getQuestionData, getQuestions, deleteQuestion} from "@/assets/classes/Question.js"
  export default {
    name: 'QuestionList',
    created(){
      console.log("heeeey")
       console.log(this.$route.path); // path is /users
    },
    async asyncData({$axios}) {
      try{
        const questions = await $axios.$get('/api/questions')
        return {questions}
      }catch(error){console.log(error)}
    },
    data(){
      return{
        listOfQuestions:[],
      }
    },
    beforeMount(){
    },
    methods: {
        deleteAQuestion: async function (idQuestion){
          await this.$axios.$delete(`api/question/${idQuestion}`).catch(error => { console.log(error) })
          this.questions = await this.$axios.$get('/api/questions') //met à jour l'affichage de la liste de question
        }
    },
  }
</script>