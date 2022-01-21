<template>
  <section id="hostSection">

    <div id="waitingSection" v-if="waitingMode">

      <div id="qrCodeContent">
        <div id="waitingMessage">
          Bienvenue au concert de l'orchestre Pixelophonia ! <br> <br>
          Scannez ce QR CODE et attendez les instructions du chef d'orchestre
          pour continuer votre périple
        </div>

        <div id="qrCode">
          <img src="../assets/images/qrCode.png">
        </div>
      </div>

      <div id="logoLong">
        <img src="../assets/images/logoLong.png">
      </div>

    </div>

    <div v-else>

      <div v-if="!displayResult">

        <div v-if="displayTimer">
          <div class="timerWrapper">
            <div id="timeProgress" ref="timeProgress"></div>
          </div>
        </div>
        <div v-else>
          <div class="spinnerWrapper">
            <div class="spinner"></div>
            </div>
            </div>

            <div id="parent" class="displayed">
              <div v-for="(data, index) in tab" :key="index+1" class="chatArea">
                <img :id="index+1" :src="require(`assets/images/Question_${id}/`+data.img)" alt="image test"
                  class="images">

              </div>
              <h2 class="question">{{questionLabel}}</h2>
            </div>
            </div>
            <div v-else>
              <div id="result">
                <div v-for="(data, index) of Object.values(parameters)" :key="index">
                  <img v-if="data.winner != null" :src="require(`assets/images/Question_${id}/`+data.winner)"
                    alt="image winner" class="images">
                  <h2> <i>{{data.percentage}}</i></h2>
                </div>
              </div>
            </div>


    </div>

  </section>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import "../assets/css/host.css";

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

      waitingMode: true,
      displayResult: false, //si c'est true c'est qu'on montre les réponses et pas la question
      displayTimer: false,

      idQuestion:0,
      questionLabel:'',
      tab:[],
    }
  },
  head: {
    title: 'Ecran de la salle'
  },
  watch: {
  },
  beforeMount () {
    socket.on("reload-this-page", (isReload) =>{
      //alert("on reload la page screen")
      location.reload(true)
    })
    // ici on récupère la question
    socket.on('display-question-on-screen', (questiondata, questionStartTime, totalTime, showTimerOnScreen)=> {
        if (this.waitingMode){this.waitingMode = false}
        //console.log('QUESTION DATA'+questiondata)
        this.displayQuestionData.push(questiondata)
        if(showTimerOnScreen){//si on a bien un temps à afficher, c'est à dire qu'il n'est pas falsy
          this.displayTimer = true
          this.afficheTimer(questionStartTime, totalTime)
        }
    }),
    // ici on récupère les images des choix de la question 
    socket.on('broadcast-question', (questiondata) => {
      this.resetAllData()//on reset les datas que quand on lance une nouvelle question pour pouvoir garder les résultats précédents à l'écran
      console.log(questiondata)
      this.tab = Object.values(questiondata.choices)
      this.displayQuestionData.push(questiondata)
      this.id = questiondata.id
      this.questionLabel = questiondata.question
      console.log(this.tab)
    })
    socket.on('display-final-choice', (totalvotes, winner, percentage) => {
       this.parameters = []
       this.displayResult = true

        this.parameters.push({totalvote:totalvotes,winner:winner.img, percentage:Math.floor(percentage)+"%" })
    }),
    // quand on arrête la partie
    socket.on('stop-partie', () => {
      this.resetAllData()
    }),
    socket.on('stop-question', () => {
      this.resetAllData()
    })
  },
  mounted () {
  },
  methods: {
    resetAllData: function(){
      this.waitingMode = true
      this.displayResult= false
      this.displayTimer= false

      this.displayQuestionData = []
      this.finalChoice = 
      this.allVotes = 0
      this.winner = {}
      this.percentage = 0
      this.parameters=[]
      //console.log('resetdata')
    },
    afficheTimer: async function(questionStartTime, totalTime){
          //======== TIMER ========//
          const timeDepart = questionStartTime
          const totalTimeMs = totalTime*1000 //on passe le temps en secondes en millisecondes

          let myTimer = setInterval(() => {
             if (!this.waitingMode){
               //console.log('SETINTERVAL')
                  let currentTime = Date.now()
                  const element = document.getElementById("timeProgress")
                  let tempsEcoule = currentTime-timeDepart //en millisecondes

                  if(tempsEcoule<=totalTimeMs){
                    element.style.width = (tempsEcoule/totalTimeMs)*100 + "%";
                    if((tempsEcoule/totalTimeMs)*100 >75){
                      element.style.backgroundColor = '#CA4B4B'; //on passe en rouge
                    }
                  }
                  else {
                    clearInterval(myTimer);
                  }
             }
             else { //si on arrête la question avant la fin, ça permet d'arrêter le timer
                    clearInterval(myTimer);
             }
        }, 10)
    }
  }
}
</script>