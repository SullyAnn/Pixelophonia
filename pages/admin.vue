<template>
<main>
  <h1>Bienvenue sur l'interface administrateur</h1>

  <div id="menu" v-show="isMenu">
      <button v-on:click.once="LaunchPartie()" v-on:click="isMenu = !isMenu" id="launchPartie" class ="btnMenu">
        Lancer la partie
      </button>
      <button class ="btnMenu" v-on:click="isMenu = !isMenu" v-on:click.once="LaunchCreation()" id="launchCreation" ><NuxtLink to="/admin/creation/">Créer votre jeu</NuxtLink></button>
  </div>

  <div id="listQuestions" v-show="!isMenu" class="questionsList">
      <h2>Liste des questions</h2>
      <ul ref="questions" class="questions">
          <li v-for="(question, index) in questions" :key="index" class="question">
              <p>{{ question.label }}</p>
              <button :id="index+1" @click="switchClass(index+1)" v-on:click="LaunchQuestion(question)" class= "btn start">
                <svg style="display:block;"
                    class="svg-icon" 
                    viewBox="0 0 1025 1024" 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M1024 512l-804.0448 512L219.9552 0 1024 512z"  />
                </svg>
                <svg style="display:none;"
                    class="svg-icon" 
                    viewBox="0 0 1024 1024" 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0l1024 0 0 1024L0 1024 0 0z"  />
                </svg>
              </button>
          </li>
      </ul>
  </div>
  <NuxtChild />
</main>
</template>





<script>
import "@/assets/css/admin.css";
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
    },

    switchSVG: function (idToChange) {
      let toChange = document.getElementById(idToChange)
        Array.from(toChange.getElementsByTagName("svg")).forEach(
            function(element) {
                if (element.style.display === "block") element.style.display = "none"
                else element.style.display = "block"
            }
        );
    },
    switchColor: function (idToChange){
      let buttonsList = document.getElementById("listQuestions").getElementsByClassName("btn")
      let btnToChange = document.getElementById(idToChange)

      if (btnToChange.classList.contains("start")) 
      {
        Array.from(buttonsList).forEach(
            function(element) {
                element.classList.remove("start")
                element.classList.add("cantSelect")
                element.disabled = true
            }
        );

        btnToChange.classList.remove("cantSelect")
        btnToChange.classList.add("stop")
        btnToChange.disabled = false
      }
      else 
      {
        Array.from(buttonsList).forEach(
            function(element) {
                element.classList.remove("cantSelect")
                element.classList.remove("stop")
                element.classList.add("start")
                element.disabled = false
            }
        );
      }
    },
    switchClass: function(idToChange) {
      this.switchSVG(idToChange)
      this.switchColor(idToChange)
    },
  }
}
</script>
