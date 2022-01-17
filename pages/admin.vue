<template>
    <div>
      mixé avec "launch Game"
        <button  v-on:click.once="LaunchPartie()" id="launchPartie" >Lancer la Partie !</button>
        <div id="listQuestions">
            <ul ref="questions" class="questions">
                <li v-for="(question, index) in questions" :key="index" class="question">
                     <button :id="index+1" v-on:click.once="LaunchQuestion(question)">{{ question.label }}</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import Choice from '@/assets/classes/Choice.js'
import Question from '@/assets/classes/Question.js'
import {getQuestions, getQuestionData} from "@/assets/classes/Question.js"
export default {
  asyncData () {
    return new Promise(resolve =>
      socket.emit('last-questions', questions => resolve({ questions }))
    )
  },
  data () {
      return {newQuestion:null,
              newChoice:[] }
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
  },
  methods: {
    LaunchPartie: function(){
      this.questions = []
        console.log("nous sommes dans lauchPArtiiie")
        // récupère les questions dans la base de données
        getQuestions()
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