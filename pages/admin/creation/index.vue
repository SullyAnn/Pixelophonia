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
import {getQuestions, deleteQuestion} from "@/assets/classes/Admin.js"
  export default {
    name: 'QuestionList',
    created(){
      console.log("heeeey")
    },
    async asyncData({$axios}) {
      try{
        const questions = await getQuestions($axios)
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
          await deleteQuestion(this.$axios, idQuestion)
          this.questions = await getQuestions(this.$axios) //met à jour l'affichage de la liste de question
        }
    },
  }
</script>