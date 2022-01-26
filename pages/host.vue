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

    <div v-else class="questionSection">

      <div v-if="!displayResult">
        <!-- nombre de votes courants sur la question -->
        <h2 v-if="votesData.total<=1" class="nbTotalVotes">{{votesData.total}} vote</h2>
        <h2 v-else class="nbTotalVotes">{{votesData.total}} votes</h2>
        <!---->

        <div id="parent" class="displayed">
          <div v-for="(data, index) in tab" :key="index+1" class="chatArea" ref="halfChoiceContainer" idChoice=data.id>
            <h1 v-if="index == 0" style="right:0; top:0;">{{data.title}}</h1>
            <h1 v-else style="left:0; bottom:0;">{{data.title}}</h1>
            <img :id="index+1" :src="require(`assets/images/Question_${id}/`+data.img)" alt="image test" class="images">
          </div>

          <div class="infoContainer">
            <h2 class="question">{{questionLabel}}</h2>

            <div class="directResults">
                <!--{{votesData.votesChoice1}}
                {{votesData.votesChoice2}}-->

              <div v-if="displayDirectResults">
                <div>
                  <div id="vote1" class="directResultMove choice1"></div>
                </div>
                <div>
                  <div id="vote2" class="directResultMove choice2"></div>
                </div>
              </div>
            </div>

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
          </div>

        </div>

      </div>
      <div v-else>
        <div id="result">
          <div v-for="(data, index) of Object.values(parameters)">
            <img v-if="data.winner != null" :src="require(`assets/images/Question_${id}/`+data.winner)"
              alt="image winner" class="images">
            <div class="infosResult">
            <h2 v-if="!data.egalite">{{data.percentage}} d’entre vous ont choisi cette voie </h2>
            <h2 v-else>Égalité ! La machine a décidé pour vous</h2>
            <h1>{{data.winnerTitle}}</h1>
            </div>
          </div>
        </div>
      </div>


          <img src="../assets/images/qrCode.png" class="qrCodeQuestion">

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
      votesData: {total:0, votesChoice1:0, votesChoice2: 0},

      waitingMode: true,
      displayResult: false, //si c'est true c'est qu'on montre les réponses et pas la question
      displayTimer: false,
      displayDirectResults: false,

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
    //debut de la connexion du host
    socket.emit("connection-host");
    socket.on("update-host-on-co-question", (questiondata, votesInfos, updateTimer) =>{
      console.log('Afficher question')
      //display question
      if (this.waitingMode){this.waitingMode = false}
      console.log(questiondata)
      this.tab = Object.values(questiondata.choices)
      this.displayQuestionData.push(questiondata)
      this.id = questiondata.id
      this.votesData = votesInfos
      this.questionLabel = questiondata.question
      console.log(this.tab)
      if(updateTimer.showTimer){//si on a bien un temps à afficher, c'est à dire qu'il n'est pas falsy
          this.displayTimer = true
          this.afficheTimer(updateTimer.start, updateTimer.total)
      }
      //----------------
    })
    socket.on("update-host-on-co-results", (totalvotes, winner, percentage, egalite, idQuestion) =>{
      console.log('Afficher résultat')
      if (this.waitingMode){this.waitingMode = false}
      this.id = idQuestion
      this.parameters = []
      this.displayResult = true
      this.parameters.push({totalvote:totalvotes,winner:winner.img,winnerTitle:winner.title,percentage:Math.floor(percentage)+"%", egalite: egalite })
    })

    socket.on("reload-this-page", (isReload) =>{
      //alert("on reload la page screen")
      location.reload(true)
    })
    // ici on récupère la question
    socket.on('display-question-on-screen', (questiondata, questionStartTime, totalTime, showTimerOnScreen, showDirectResultsOnScreen)=> {
        if (this.waitingMode){this.waitingMode = false}
        //console.log('QUESTION DATA'+questiondata)
        this.displayQuestionData.push(questiondata)
        if(showTimerOnScreen){//si on a bien un temps à afficher, c'est à dire qu'il n'est pas falsy
          this.displayTimer = true
          this.afficheTimer(questionStartTime, totalTime)
        }
        if(showDirectResultsOnScreen){//si on veut bien afficher les résultats en direct à afficher, c'est à dire qu'il n'est pas falsy
          this.displayDirectResults = true
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
    socket.on('display-final-choice', (totalvotes, winner, percentage, egalite) => {
       this.parameters = []

      //transition avant de passer au résultat
      if(window.innerWidth>768){
        this.$refs['halfChoiceContainer'][winner.id-this.tab[0].id].style.width = "100%"
        this.$refs['halfChoiceContainer'][Math.abs(winner.id-this.tab[1].id)].style.width = "0%"
      }
      else{ //si l'écran est trop petit, on passe en vertical
        this.$refs['halfChoiceContainer'][winner.id-this.tab[0].id].style.height = "100%"
        this.$refs['halfChoiceContainer'][Math.abs(winner.id-this.tab[1].id)].style.height = "0%"
      }
        setTimeout(function () {
            this.displayResult = true
            console.log('HELLO 1sec')
        }.bind(this), 1500)

        this.parameters.push({totalvote:totalvotes,winner:winner.img,winnerTitle:winner.title,percentage:Math.floor(percentage)+"%", egalite: egalite })
    }),
    // quand on arrête la partie
    socket.on('stop-partie', () => {
      this.resetAllData()
    }),
    socket.on('stop-question', () => {
      this.resetAllData()
    }),
    socket.on('augmentation-nb-votes', (votesInfos) => {
      this.votesData = votesInfos
      console.log(votesInfos)
      document.getElementById("vote1").style.width = `${(votesInfos.votesChoice1/votesInfos.total)*100}%`
      document.getElementById("vote2").style.width = `${(votesInfos.votesChoice2/votesInfos.total)*100}%`
    })
  },
  mounted () {
  },
  methods: {
    resetAllData: function(){
      this.waitingMode = true
      this.displayResult= false
      this.displayTimer= false
      this.displayDirectResults= false

      this.displayQuestionData = []
      this.finalChoice = 
      this.allVotes = 0
      this.winner = {}
      this.percentage = 0
      this.parameters=[]
      this.votesData= {total:0, votesChoice1:0, votesChoice2: 0}
      //console.log('resetdata')
    },
    afficheTimer: async function(questionStartTime, totalTime){
          //======== TIMER ========//
          const timeDepart = questionStartTime
          const totalTimeMs = totalTime*1000 //on passe le temps en secondes en millisecondes

          let myTimer = setInterval(() => {
            // console.log('TIMER TURNING')
             if (!this.waitingMode){
               //console.log('SETINTERVAL')
                  let currentTime = Date.now()
                  const element = document.getElementById("timeProgress")
                  let tempsEcoule = currentTime-timeDepart //en millisecondes

                  if(tempsEcoule<=totalTimeMs){
                    //element.style.width = (tempsEcoule/totalTimeMs)*100 + "%";
                    element.style.width = "calc(16px + ("+tempsEcoule/totalTimeMs+" * (100% - 16px)))";
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
    },
  }
}
</script>