<template>
<div>
  host

  <div v-if="waitingMode">
    Afficher le truc d'attente de question
  </div>
  <div v-else>
    afficher le reste

    <div v-if="!displayResult">
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
      <div id="parent" class="displayed">
            <div v-for="(data, index) in displayQuestionData" :key="index+1" class="chatArea">
                <img v-if="data.img != null" :id="index+1" :src="require('assets/images/'+data.img)" alt="image test" class="images">
                <h2 v-else>{{data.question}}</h2>
            </div>
      </div>
    </div>
    <div v-else>
      <div id="result">
          <div v-for="(data, index) of Object.values(parameters)">
              <img v-if="data.winner != null" :src="require('assets/images/'+data.winner)" alt="image winner" class="images">
              <h2> <i>{{data.percentage}}</i></h2>
          </div>
      </div>
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
      timeIsDone: false,

      waitingMode: true,
      displayResult: false, //si c'est true c'est qu'on montre les réponses et pas la question
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
        if (this.waitingMode){this.waitingMode = false}

        console.log('QUESTION DATA'+questiondata)
        this.displayQuestionData.push(questiondata)

        //======== TIMER ========//
        //console.log('START TIME' + questionStartTime)
        this.timeDepart = questionStartTime
        //this.timeDepart = Date.now() //le temps démarre qua quand ça arrive sur host
        let myTimer = setInterval(() => {
          if (!this.waitingMode){ //on vérifie qu'on est toujours en train de jour la question, au cas où l'admin arrete la question avant la fin
                this.currentTime = Date.now()
                var element = document.getElementById("timeProgress")

                let tempsEcoule = this.currentTime-this.timeDepart //en millisecondes

                if(tempsEcoule<=this.totalTime){
                  element.style.width = (tempsEcoule/this.totalTime)*100 + "%";
                  if((tempsEcoule/this.totalTime)*100 >75){
                    element.style.backgroundColor = '#CA4B4B'; //on passe en rouge
                  }
                }
                else {
                  if(!this.waitingMode)
                    socket.emit('calcul-resultat')
                  clearInterval(myTimer);
                  element.style.backgroundColor = '#98A8CC';//on remet en bleu
                  this.timeIsDone = false
                }
        }
      }, 10);
    }),
    // ici on récupère les images des choix de la question 
    socket.on('broadcast-question', (questiondata) => {
      this.resetAllData()//on reset les datas que quand on lance une nouvelle question pour pouvoir garder les résultats précédents à l'écran
      console.log(questiondata)
        for (const [key, value] of Object.entries(questiondata)) {
          this.displayQuestionData.push(value)
          //console.log(value)
        }
    })
    socket.on('display-final-choice', (totalvotes, winner, percentage) => {
       this.parameters = []
       //document.getElementById("parent").classList.remove('displayed') // temporaire
       this.displayResult = true

        this.parameters.push({totalvote:totalvotes,winner:winner.img, percentage:Math.floor(percentage)+"%" })
    }),
    // quand on arrête la partie
    socket.on('stop-partie', () => {
      this.resetAllData()
    }),
    socket.on('stop-question', () => {
      // this.resetAllData()
    })
  },
  mounted () {
  },
  methods: {
    resetAllData: function(){
      this.waitingMode = true
      this.displayResult= false

      this.displayQuestionData = []
      this.finalChoice = 
      this.allVotes = 0
      this.winner = {}
      this.percentage = 0
      this.parameters=[]
      //console.log('resetdata')
    }
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
  /*transition: 0.2s ease;*/
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