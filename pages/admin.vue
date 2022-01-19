<template>
<main>
  <h1>Bienvenue sur l'interface administrateur</h1>

  <div id="menu" v-show="isMenu">
      <NuxtLink to="/admin" class="linkBtnMenu">
      <button v-on:click.once="LaunchPartie()" v-on:click="isMenu = !isMenu; isLaunched = !isLaunched" id="launchPartie" class ="btnMenu">
        Lancer la partie
      </button>
      </NuxtLink>
      <NuxtLink to="/admin/creation/" class="linkBtnMenu">
      <button class ="btnMenu" v-on:click="isMenu = !isMenu" v-on:click.once="LaunchCreation()" id="launchCreation" >
        Créer votre jeu
      </button>
      </NuxtLink>
  </div>

  <div id="listQuestions" v-show="isLaunched" class="questionsList">
      <h2>Liste des questions</h2>
      <ul ref="questions" class="questions">
          <li v-for="(question, index) in questions" :key="index" class="question">
              <p>{{ question.label }}</p>
              <button :id="index+1" @click="switchClass(index+1)" v-on:click="toggleQuestion(question)" class= "btn start">
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

    <div class="goBack" v-on:click="isMenu = !isMenu; isLaunched = !isLaunched">
        <button class="btn back">
        <svg class="svg-icon" 
            viewBox="0 0 1024 1024" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg">
            <path d="M810.666667 554.666667H213.333333c-25.6 0-42.666667-17.066667-42.666666-42.666667s17.066667-42.666667 42.666666-42.666667h597.333334c25.6 0 42.666667 17.066667 42.666666 42.666667s-17.066667 42.666667-42.666666 42.666667z"  />
            <path d="M512 853.333333c-12.8 0-21.333333-4.266667-29.866667-12.8l-298.666666-298.666666c-17.066667-17.066667-17.066667-42.666667 0-59.733334l298.666666-298.666666c17.066667-17.066667 42.666667-17.066667 59.733334 0s17.066667 42.666667 0 59.733333L273.066667 512l268.8 268.8c17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 8.533333-17.066667 12.8-29.866667 12.8z"  />
        </svg>    
        </button>
        Mettre fin au jeu
    </div>

  </div>
  <NuxtChild />
</main>
</template>





<script>
import "@/assets/css/admin.css";
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
              isLaunched:false,
              isReload: false,
              questionIsPlaying: false,
              }
  },
  created(){
    this.newQuestion = new Question(null,null,null,null)
  },
  head: {
    title: 'Admin'
  },
  watch: {
    },
  beforeMount () {
    },
  mounted () {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      console.info( "This page is reloaded" );
      this.isMenu = true;
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

        //socket.emit('start-partie')
    },
    toggleQuestion: function(questiondata){
      this.questionIsPlaying = !this.questionIsPlaying

      if(this.questionIsPlaying){//on lance une question
        console.log(questiondata)
        console.log("LaunchQuestion "+questiondata.id)
        const questionStartTime = Date.now(); //temps de départ de la question
        socket.emit("display-question", questiondata, questionStartTime)
      }
      else{//sinon c'est qu'on est en train de l'arrêter
        socket.emit("stop-question")
      }
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
    stopPartie: function(){
        this.isMenu = !this.isMenu
        socket.emit('stop-partie')
    }
  }
}
</script>
