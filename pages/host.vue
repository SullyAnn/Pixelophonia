<template>
<div>
  host
  <!--<h2>{{currentTime}}</h2>-->
  <div v-if="timeDepart!=''">
    <div class="timerWrapper">
      <div id="timeProgress"></div>
    </div>
  </div>
  <div v-else>
    <div class="spinnerWrapper">
      <div class="spinner"></div>
    </div>
  </div>
    <div id="result">
        <div v-for="(data, index) of Object.values(parameters)">
            <img v-if="data.winner != null" :src="data.winner" alt="image winner" class="images">
            <h2> <i>{{data.percentage}}</i></h2>
        </div>
    </div>
    <div id="parent" class="displayed">
          <div v-for="(data, index) in displayQuestionData" :key="index+1" class="chatArea">
              <img v-if="data.img != null" :id="index+1" :src="data.img" alt="image test" class="images">
              <h2 v-else>{{data.question}}</h2>
          </div>

    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import {compareChoices, calculatePercentage} from "@/assets/classes/Question.js"
export default {
  asyncData () {
    return new Promise(resolve =>
      socket.emit('data-for-screen', displayQuestionData => resolve({ displayQuestionData }))
    )
  },
  data () {
    return{
      finalChoice:[],
      allVotes:0,
      winner:{},
      percentage:0,
      parameters:[],

      currentTime: '',
      totalTime: 10000, //temps donné pour répondre, en millisecondes (pour l'instant par défaut)
      timeDepart: '',
      tempsEcoule: 0,
      timeIsDone: false,
    }
  },
  head: {
    title: 'Nuxt.js with Socket.io'
  },
  watch: {
  },
  beforeMount () {
    socket.on("reload-this-page", (isReload) =>{
      //alert("on reload la page screen")
      location.reload(true)
    })
    // ici on récupère la question
    socket.on('display-question-on-screen', (questiondata, questionStartTime)=> {
        console.log(questiondata)
        this.displayQuestionData.push(questiondata)

        //======== TIMER ========//
        //console.log('START TIME' + questionStartTime)
        this.timeDepart = questionStartTime
        let myTimer = setInterval(() => {
                this.currentTime = Date.now()
                var element = document.getElementById("timeProgress")

                let tempsEcoule = this.currentTime-this.timeDepart //en millisecondes

                if(tempsEcoule<=this.totalTime){
                  element.style.width = (tempsEcoule/this.totalTime)*100 + "%";
                  if((tempsEcoule/this.totalTime)*100 >75){
                    element.style.backgroundColor = '#CA4B4B';
                  }
                }
                else {
                  socket.emit('show-results-timer-done')
                  clearInterval(myTimer);
                }
      }, 10);
    }),
    // ici on récupère les images des choix de la question 
    socket.on('broadcast-question', (questiondata) => {
      console.log(questiondata)
        for (const [key, value] of Object.entries(questiondata)) {
          this.displayQuestionData.push(value)
          //console.log(value)
        }
    }),
    socket.on('display-final-choice', (choice) => {
      console.log("maintenant on est dans le 'display-final-choice du grand écran" )
       this.parameters = []
      // la variable choice est un objet contenant un objet "totalVotes" et un autres "choices" (celui ci contient toutes les instances de choices existantes pour cette question)
        
        //console.log(JSON.stringify(choice.totalVotes))
        document.getElementById("parent").classList.remove('displayed') // temporaire
        this.finalChoice = choice.choices

        const arrayChoices = Object.values(this.finalChoice) //conversion de l'objet en tableau
        this.allVotes = choice.totalVotes // on récupère le nombre total de votes
        this.winner = compareChoices(arrayChoices.at(0), arrayChoices.at(1)) // on cherche le choix qui a eu le plus de votes
        this.percentage=calculatePercentage(this.winner, this.allVotes) // on calcule le pourcentage du choix gagnant
        // on récupère toutes ces infos dans un tableau pour l'affichage en html
        this.parameters.push({totalvote:this.allVotes,winner:this.winner.img, percentage:Math.floor(this.percentage)+"%" })
    })
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
#parent.displayed{
    display:flex;
    visibility:visible;
}
#parent{
  visibility:hidden;
    justify-content:center;
}

.chatArea{
  height:100vh;
  width:50vw;
  overflow:hidden;
}
.images{
height:100%;
}
.question{
  
}
#parent div:last-child{
position : absolute;
   top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height:auto;
  width:auto;
}

.timerWrapper{
  width: 100%;
  height: 16px;
  background-color: #D5DDE5;
  border-radius: 50px;
  position: relative;
}
#timeProgress{
  width: 0;
  height: 100%;
  background-color: #98A8CC;
  border-radius: 50px;
  transition: 0.2s ease;
}

.spinnerWrapper{
  width: 120px;
  height:120px;
}
.spinner,
.spinner:after {
  border-radius: 50%;
  width: calc(100% - 32px);
  height: calc(100% - 32px);
}
.spinner {
  position: relative;
  border-top: 16px solid #D5DDE5;
  border-right: 16px solid #D5DDE5;
  border-bottom: 16px solid #D5DDE5;
  border-left: 16px solid #98A8CC;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>