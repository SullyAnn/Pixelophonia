<template>
    <div>

      <!-- menu = équivalent index audrey -->
      <div v-show="isMenu">
          <button  v-on:click.once="LaunchPartie()" v-on:click="isMenu = !isMenu" id="launchPartie" >Lancer la Partie !</button>
          <NuxtLink to="/admin/creation/"><button  v-on:click="isMenu = !isMenu" v-on:click.once="LaunchCreation()" id="launchCreation" >Créer votre jeu</button></NuxtLink>
      </div>
        
      <div id="listQuestions" v-show="!isMenu">
          <h2>Liste des questions : </h2>
          <ul ref="questions" class="questions">
              <li v-for="(question, index) in questions" :key="index" class="question">
                    <button :id="index+1" v-on:click.once="LaunchQuestion(question)">{{ question.label }}</button>
              </li>
          </ul>
      </div>
      <NuxtChild />
    </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import Choice from '@/assets/classes/Choice.js'
import Question from '@/assets/classes/Question.js'
import {getQuestions} from "@/assets/classes/Admin.js"
export default {
  asyncData () {
    return new Promise(resolve =>
      socket.emit('last-questions', questions => resolve({ questions }))
    )
  },
  data () {
      return {newQuestion:null,
              newChoice:[], 
              isMenu : true ,
              isReload: false}
  },
  created(){
    this.newQuestion = new Question(null,null,null,null)
  },
  head: {
    title: 'Nuxt.js with Socket.io'
  },
  watch: {
  },
  beforeMount () {
  },
  mounted () {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      console.info( "This page is reloaded" );
      this.isReload = true;
      socket.emit("reload-all-pages", this.isReload)
    } else {
      console.info( "This page is not reloaded");
    }
  },
  methods: {
    LaunchCreation: function(){
      this.questions = []
        console.log("nous sommes dans création")
        // récupère les questions dans la base de données
        // getQuestions()
        // .then(listQuestions => {
        //     socket.emit("list-question-creation", listQuestions)
        // })
    },
    LaunchPartie: function(){
      this.questions = []
        console.log("nous sommes dans lauchPArtiiie")
        // récupère les questions dans la base de données
        getQuestions(this.$axios)
        .then(listQuestions => {
            listQuestions.forEach((question) => {
              question.choices.forEach((choice) => {
                // instanciation des objets Choice de la question
                this.newChoice.push(new Choice(choice.id, choice.title, choice.img))
              })
                //console.log(question)

                // instanciation de l'objet Question
                this.newQuestion = new Question(question.id, question.label, question.question, this.newChoice),
                //console.log(this.newQuestion),
                this.questions.push(this.newQuestion)
                this.newChoice=[]
                //console.log(this.questions)
            })
        })
    },
    LaunchQuestion: function(questiondata){
      console.log(questiondata)
        console.log("LaunchQuestion "+questiondata.id)
        socket.emit("display-question", questiondata)
    }
  }
}
</script>

<style>
.chatArea{
    display:flex;
    justify-content:center;
}
.images{

}
</style>