<template>
  <div id="listQuestions" class="questionsList">
      <h2>Liste des questions</h2>
      <ul ref="questions" class="questions">
          <li v-for="(question, index) in questions" :key="index" class="question">
              <p>{{ question.label }}</p>
              <button :id="index+1" @click="switchClass(index+1), toggleQuestion(question)" class="btn start">
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

    <div class="goBack" @click="stopPartie()">
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
</template>


<script>
import "@/assets/css/admin.css";
import socket from '~/plugins/socket.io.js'
import Choice from '@/assets/classes/Choice.js'
import Question from '@/assets/classes/Question.js'
import {getQuestions} from "@/assets/classes/Admin.js"

export default {
head: {
    title: 'Lancer le jeu'
},

asyncData () {
    return new Promise(resolve =>
    socket.emit('last-questions', questions => resolve({ questions }))
    )
},
data () {
    return {
        newQuestion:null,
        newChoice:[],
        isReload: false,
        questionIsPlaying: false,
    }
},
created(){
    this.newQuestion = new Question(null,null,null,null)
},

mounted () {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) 
    {
        console.info( "This page is reloaded" );
        this.reload = true,
        socket.emit("reload-all-pages", this.isReload)

    } 
    else {
        console.info( "This page is not reloaded");
    }

    this.launchPartie()
    
},

methods: {

    // ========= BACK ========== //

    // start game 
    launchPartie: function(){
        this.questions = []
        // get all questions in database
        getQuestions(this.$axios).then(listQuestions => {
            listQuestions.forEach((question) => {
                // instanciate Choice objects in question
                question.choices.forEach((choice) => {
                    this.newChoice.push(new Choice(choice.id, choice.title, choice.img))
                })

                // instanciate Question object
                this.newQuestion = new Question(question.id, question.label, question.question, this.newChoice),
                this.questions.push(this.newQuestion)
                this.newChoice=[]
            })
        })
    },

    // launch one question : à voir pour grouper avec switch class ?
    toggleQuestion: function(questiondata){
        this.questionIsPlaying = !this.questionIsPlaying

        if (this.questionIsPlaying) { //on lance une question
            console.log(questiondata)
            console.log("LaunchQuestion "+questiondata.id)
            const questionStartTime = Date.now(); //temps de départ de la question
            socket.emit("display-question", questiondata, questionStartTime)
        }
        else { //sinon c'est qu'on est en train de l'arrêter
            socket.emit("stop-question", 2)
            console.log("question arrêtée")
        }
    },

    // ========= FRONT ========= //
    
    // switch square & triangle (start/stop buttons) 
    switchSVG: function (idToChange) {
      let toChange = document.getElementById(idToChange)
        Array.from(toChange.getElementsByTagName("svg")).forEach(
            function(element) {
                if (element.style.display === "block") element.style.display = "none"
                else element.style.display = "block"
            }
        );
    },

    // switch green & red (start/stop buttons)  
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

    // switch start & stop buttons
    switchClass: function(idToChange) {
      this.switchSVG(idToChange)
      this.switchColor(idToChange)
    },
    
    stopPartie: function(){
        socket.emit('stop-partie')
        console.log("Partie arrêtée.")
        this.$router.push("./")
    }
  }
}
</script>
