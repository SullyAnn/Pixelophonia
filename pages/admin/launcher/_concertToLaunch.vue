<!-- questions contenues dans le concert -->
<template>
  <div>
    <AdminHeader />
    <div id="listQuestions" class="questionsList launchPage">
      <h2>Liste des questions</h2>
      <ul ref="questions" class="questions">
        <li v-for="(question, index) in tabQuestions" :key="index" class="question" ref="questionInList">
          <div class="labelAndStartBtnWrapper">
            <div>
              <p>{{ question.label }}</p>
              
              <div class="settingsContainer">
                <span>Paramètres sur l'écran</span>
                <!-- option de visibilité des résultats en direct -->
                <label class="checkLabel checkDirectResultLabel switch">
                  Résultats en direct<input type="checkbox" name="checkDirectResult" class="checkDirectResult"><span class="slider round"></span>
                </label>
                <!-- option de visibilité du temps -->
                <div v-if="question.temps">
                  <label class="checkLabel checkTimeLabel switch">
                    Barre de temps<input type="checkbox" name="checkTime" class="checkTime" checked><span class="slider round"></span>
                  </label>
                </div>
              </div>

            </div>
            <button :id="index+1" @click="switchClass(index+1), toggleQuestion(question, index)" class="btn start">
              <svg style="display:block;" class="svg-icon" viewBox="0 0 1025 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M1024 512l-804.0448 512L219.9552 0 1024 512z" />
              </svg>
              <svg style="display:none;" class="svg-icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0l1024 0 0 1024L0 1024 0 0z" />
              </svg>
            </button>
          </div>

          <div v-if="question.temps" class="timeQuestionOptions">
            <div class="timerWrapper">
              <div id="timeProgress" class="timeProgress"></div>
            </div>
          </div>

          <div v-if="!question.temps" class="btnLaunchResults">
            <!-- si la question est infinie, mettre un bouton pour choisir quand lancer le calcule des résultats -->
            <div v-if="questionIsPlaying && indexQuestionPlaying == index && displayBtnLancerResultat">
              <button @click="launchResultsNoTimer(index)">Lancer les résultats</button>
            </div>
          </div>

          <!-- nombre de votes courants sur la question -->
          <div v-if="questionIsPlaying && indexQuestionPlaying == index" class="nbTotalVotes">
            <table>
              <tr>
                <th colspan="2">Nombre de votes</th>
              </tr>
              <tr>
                <td>{{question.choices[0].title}}</td>
                <td>{{votesData.votesChoice1}}</td>
              </tr>
              <tr>
                <td>{{question.choices[1].title}}</td>
                <td>{{votesData.votesChoice2}}</td>
              </tr>
              <tr>
                <th>Total</th>
                <th>{{votesData.total}}</th>
              </tr>
            </table>
          </div>

        </li>
      </ul>

      <div class="goBack" @click="stopPartie()">
        <button class="btn back">
          <svg class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M810.666667 554.666667H213.333333c-25.6 0-42.666667-17.066667-42.666666-42.666667s17.066667-42.666667 42.666666-42.666667h597.333334c25.6 0 42.666667 17.066667 42.666666 42.666667s-17.066667 42.666667-42.666666 42.666667z" />
            <path
              d="M512 853.333333c-12.8 0-21.333333-4.266667-29.866667-12.8l-298.666666-298.666666c-17.066667-17.066667-17.066667-42.666667 0-59.733334l298.666666-298.666666c17.066667-17.066667 42.666667-17.066667 59.733334 0s17.066667 42.666667 0 59.733333L273.066667 512l268.8 268.8c17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 8.533333-17.066667 12.8-29.866667 12.8z" />
          </svg>
        </button>
        Mettre fin au jeu
      </div>

    </div>
  </div>
</template>


<script>
import "@/assets/css/admin.css";
import "@/assets/css/launch.css";
import socket from '~/plugins/socket.io.js'
import Choice from '@/assets/classes/Choice.js'
import Question from '@/assets/classes/Question.js'
import {getQuestion, getConcert} from "@/assets/classes/Admin.js"

export default {
head: {
    title: 'Lancer le jeu'
},

async asyncData ({$axios, params}) {
        try {
        const id = params.concertToLaunch
        const concert = await getConcert($axios, id)
        const questionsInConcert = []

        // add to questions all questions contained in concert
        for (let element of concert.questions) {
            questionsInConcert.push(await getQuestion($axios, element.questionId))
        }        
        return {concert, questionsInConcert}
    } 
    catch (error) {
        console.log(error)
    }
},
data () {
    return {
        newQuestion:null,
        newChoice:[],
        isReload: false,
        questionIsPlaying: false,
        indexQuestionPlaying: -1,
        votesData: {total:0, votesChoice1:0, votesChoice2: 0},
        displayBtnLancerResultat: true,
        tabQuestions : []
    }
},
created(){
    this.newQuestion = new Question(null,null,null,null)
},
beforeMount () {
    socket.on('augmentation-nb-votes', (votesInfos) => {
      this.votesData = votesInfos
    })
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
    this.tabQuestions = []
    socket.emit("affichage-menu", 1)
    console.log("test")

    // get all questions in database
    this.questionsInConcert.forEach(question => {
        // instanciate Choice objects in question
        question.choices.forEach((choice) => {
            this.newChoice.push(new Choice(choice.id, choice.title, choice.img))
        })

        console.log("newChoice", this.newChoice)

        // instanciate Question object
        this.newQuestion = new Question(question.id, question.label, question.question, question.temps, this.newChoice),
        this.tabQuestions.push(this.newQuestion)
        this.newChoice=[]

        console.log("questions ?")
        console.log(this.tabQuestions)
    })
},

    // launch one question : à voir pour grouper avec switch class ?
    toggleQuestion: function(questiondata, idQuestionList){
      this.questionIsPlaying = !this.questionIsPlaying

      if(this.questionIsPlaying){//on lance une question
        this.indexQuestionPlaying = idQuestionList
        console.log(questiondata)
        console.log("LaunchQuestion "+questiondata.id)
        const questionStartTime = Date.now(); //temps de départ de la question

        //display de la barre de temps ou non
        let showTimerOnScreen = false
        if(questiondata.temps){//si la question est timée, on regarde si l'admin a coché la case visibilité ou pas
          showTimerOnScreen = this.$refs['questionInList'][idQuestionList].querySelector('.checkTime').checked
          console.log('CHECK'+showTimerOnScreen)
        }
        else{ //sinon c'est que la question a un temps indéterminé
          showTimerOnScreen = false
        }

        //display des votes ou non
        let showDirectResultsOnScreen = false
        if(this.$refs['questionInList'][idQuestionList].querySelector('.checkDirectResult').checked){showDirectResultsOnScreen = true}
        console.log('SHOW RESULSTS :'+showDirectResultsOnScreen)

        console.log("question data dans launchquestion", questiondata)
        socket.emit("display-question", questiondata, questionStartTime, showTimerOnScreen, showDirectResultsOnScreen)
        if(questiondata.temps){ //si il y a un temps défini pour la question
          this.launchTimer(questionStartTime, questiondata.temps, idQuestionList) //lancer le timer chez l'admin
        }
      }
        else { //sinon c'est qu'on est en train de l'arrêter
            socket.emit("stop-question", 1)
            console.log("question arrêtée")
            this.indexQuestionPlaying = -1
            this.displayBtnLancerResultat = true
            this.votesData={total:0, votesChoice1:0, votesChoice2: 0}
            if(questiondata.temps){ //réinitialisation de la bar pour question à temps
              const timerWrapper = this.$refs['questionInList'][idQuestionList].querySelector('.timerWrapper')
              timerWrapper.style.cssText ="display:none;"
              var element = this.$refs['questionInList'][idQuestionList].querySelector('.timeProgress')
              element.style.backgroundColor = '#0CB4CE';//on réinitialise la barre de progrès
              element.style.width = 0 + "%";
            }
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
        socket.emit('stop-partie', 2)
        console.log("Partie arrêtée.")
        this.$router.push("../launch")
    }, 
    launchTimer: function(questionStartTime, totalTime, idQuestionList){
          const timerWrapper = this.$refs['questionInList'][idQuestionList].querySelector('.timerWrapper')
          timerWrapper.style.cssText ="display:block;"
          //======== TIMER ========//
          console.log('START TIME' + questionStartTime)
          const timeDepart = questionStartTime
          const totalTimeMs = totalTime*1000 //on passe le temps en secondes en millisecondes

          var element = this.$refs['questionInList'][idQuestionList].querySelector('.timeProgress')

          let myTimer = setInterval(() => {
                  let currentTime = Date.now()
                  //console.log('SETINTERVAL')

                  let tempsEcoule = currentTime-timeDepart //en millisecondes

                  if(tempsEcoule<=totalTimeMs){
                    //element.style.width = (tempsEcoule/totalTimeMs)*100 + "%";
                    element.style.width = "calc(16px + ("+tempsEcoule/totalTimeMs+" * (100% - 16px)))";
                    if((tempsEcoule/totalTimeMs)*100 >75){
                      element.style.backgroundColor = '#CA4B4B'; //on passe en rouge
                    }
                  }
                  else {
                    socket.emit('calcul-resultat')
                    clearInterval(myTimer);
                  }

                  if(!this.questionIsPlaying){ //si on arrete la question avant la fin
                    element.style.width = 0 + "%";
                    element.style.backgroundColor = '#0CB4CE';
                    clearInterval(myTimer)
                  }
        }, 10)
    },
    launchResultsNoTimer: function(idQuestionList){
      if(this.questionIsPlaying){ //on vérifie qu'il y a bien une question en cours pour lancer les résultats
        socket.emit('calcul-resultat')
        //this.indexQuestionPlaying = -1 //fait disparaître le bouton pour lancer les résultat de sorte qu'on le lance qu'une seule fois
        this.displayBtnLancerResultat = false
      }
    }
  }
}
</script>
