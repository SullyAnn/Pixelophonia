<template>
  <section>
    <div v-show="isQuestionDisplayed==true" id="choicePageContent">
      <div v-if="!displayResult" class="container">
        <div id="orBlock">
          <div v-if="!choiceIsSubmitted">
          <button v-if="selectedChoiceId!=-1" v-on:click="sendChoice(selectedChoiceId)" class="btnSubmitChoice">Valider mon choix</button>
          <p v-else>OU</p>
          </div>
          <p v-else class="confirmationSubmit">Votre réponse a bien été envoyée !</p>
        </div>

        <div v-for="(data, index) in choices" :key="index" class="choice" v-on:click="selectChoice(index)" ref="choiceSelection">
          <h1 v-if="index == 0" style="right:0; top:0;">{{data.title}}</h1>
          <h1 v-else style="left:0; bottom:0;">{{data.title}}</h1>
          <img :id="index" :src="require(`assets/images/Question_${idQuestion}/`+data.img)" alt="image test">
        </div>
      </div>

      <div id="resultSection" v-else>
        <div class="resultMessage" v-if="choiceId == winnerID">
          <p class="resultText">Bien joué voyageur! Nous nous dirigeons vers la direction souhaitée </p>
        </div>
        <div  class="resultMessage" v-else>
          <p class="resultText">Pas de chance, nous empruntons l'autre chemin </p>
        </div>
        <img :src="require(`assets/images/Question_${idQuestion}/`+this.parameters[0].winner)" alt="image test">
      </div>

    </div>

    <div v-show="isQuestionDisplayed==false" id="homePageContent">
      <div id="logoLong">
        <img id="imageLogoLong" src="@/assets/images/logoLong.png">
      </div>

      <div >
        <p class="homePageText" v-if="affichage ==0"> Bienvenue sur l'application Pixelophonia,
          <br>L'ochestre ne propose aucun jeu pour le moment.
        </p>
        <p class="homePageText" v-else-if="affichage==1"> Bienvenue sur l'application Pixelophonia,
          <br> Attendez les instructions du chef d'ochestre pour pouvoir voter </p>
        <p class="homePageText" v-else-if="affichage==2"> Merci pour votre participation! </p>
      </div>
    </div>

  </section>
</template>

<script>
import socket from '~/plugins/socket.io.js';
import "../assets/css/playerChoice.css";
import "../assets/css/playerHomePages.css";
import "../pages/admin/launch.vue";

export default {
  asyncData () {
    return new Promise(resolve =>{
        socket.emit('last-choices', choices => resolve({ choices }))
    })
  },
  data () {
     return { idQuestion : null,
        finalChoice:[],
        allVotes:0,
        winner:{},
        percentage:0,
        parameters:[],
       displayResult: false, //si c'est true c'est qu'on montre les réponses et pas la question
       IsChoice1Disabled: true,
       isQuestionDisplayed : false,
       affichage : 0,
       selectedChoiceId: -1,
       choiceIsSubmitted: false,
       isTimerDone : false,
       winnerID : -1,
       choiceId : -1,
       keepChoiceIdInMemory : -1
    }
  },
  head: {
    title: 'Joueur'
  },
  watch: {
    
  },
  beforeMount () {
    //debut de la connexion du player
    socket.emit("connection-player");
    socket.on("update-on-co-partie-playing", () =>{
      this.affichage = 1
      console.log('Afficher le texte de partie en cours')
    })
    socket.on("update-on-co-question", (questiondata) =>{
      console.log('Afficher question')
      //display question
      if (this.waitingMode){this.waitingMode = false}
      this.choices = []
      this.idQuestion = questiondata.id
      this.choices = Object.values(questiondata.choices)
      console.log(this.choices)
      this.isQuestionDisplayed = true
      //----------------
    })
    socket.on("update-on-co-results", (totalvotes, winner, percentage, egalite, idQuestion) =>{
      console.log('Afficher résultat')
      if (this.waitingMode){this.waitingMode = false}
      this.isQuestionDisplayed = true
      this.idQuestion = idQuestion
      this.displayResult = true
      this.parameters = []
      this.parameters.push({totalvote:totalvotes,winner:winner.img, percentage:Math.floor(percentage)+"%" })
    })

  /*  socket.on("reload-this-page", (isReload) =>{
      //alert("reload la page player")
      //location.reload(true)
    })*/
     socket.on('affiche-menu', (displayStatus) => {
      this.isQuestionDisplayed = false
      this.affichage = displayStatus
    })
  
    socket.on('broadcast-question', (questiondata) => {
        this.resetAllData()
        if (this.waitingMode){this.waitingMode = false} //comme on a lancé une question on est plus en waitingMode
        this.choices = []
        this.idQuestion = questiondata.id
        this.choices = Object.values(questiondata.choices)
          console.log("dans broadcast", this.choices)
        console.log(this.choices)
        this.isQuestionDisplayed = true
    })
    socket.on('get-votes-not-validated',()=>{
      if(!this.choiceIsSubmitted && this.keepChoiceIdInMemory != -1){ 
        console.log("choiceIsSubmitted is FALSE : le joueur n'a pas validé",this.keepChoiceIdInMemory )
        this.sendChoice(this.keepChoiceIdInMemory)
      }   
      this.justWait()   
    })
    socket.on('display-player-choice', (choice) => {
        console.log("maintenant on est dans le display-player-choice du client " + choice.yourchoice )
        // on empêche le player de changer de vote (ça bloque les événements sur le click)
        this.IsChoice1Disabled = false;
        // effet grisé une fois une image sélectionnée
        if(choice.yourchoice == 0)  {
          document.getElementById("1").style.filter = "grayscale(1) brightness(0.6)"
          document.getElementById("0").style.filter="brightness(1.25)"}
        else if(choice.yourchoice == 1){ 
        document.getElementById("0").style.filter = "grayscale(1) brightness(0.6)"
        document.getElementById("1").style.filter="brightness(1.25)"
        } 
        //console.log("IsChoice1Disabled = " + this.IsChoice1Disabled)
        
    }),
    socket.on('display-final-choice', (totalvotes, winner, percentage, egalite) => {
      
      console.log('DISPLAY LE RESULTAT')
      this.displayResult = true

      this.parameters = []

      this.parameters.push({totalvote:totalvotes,winner:winner.img, percentage:Math.floor(percentage)+"%" })
       
    }),
    socket.on('stop-partie', (displayStatus) => {
      this.isQuestionDisplayed = false
      this.affichage = displayStatus
    }),
    socket.on('stop-question', (displayStatus) => {
      if(this.displayResult==false){
        this.resetAllData()
        this.isQuestionDisplayed = false
        this.affichage = displayStatus
      }else {
        this.isQuestionDisplayed = true
      }
    })
    socket.on('winnerChoice',(winner)=>{
      this.winnerID = winner.id;
      console.log("winnerChoice", winner.id)
    })
  
  },
  mounted () {
    // if(!this.$session.exists()){
    //   this.$session.start();
    // }
  },
  methods: {
    sendChoice: function(idChoice){
        
      if(!this.IsChoice1Disabled){return} // trouver une meilleure solution pour désactiver event click sur les images
      console.log("vous avez cliqué sur l'image " + idChoice)
      const idPlayerChoice = Object.values(this.choices).at(idChoice).id
      this.choiceId = idPlayerChoice
      console.log("choiceId", this.choiceId)

      console.log("choice a", this.choices)

      this.choices.find(element => element.id == idPlayerChoice).nbvotes++
      //console.log(Object.values(this.choices).at(0).nbvotes)
      console.log("choice b", this.choices)

      // transmission des choix possibles et de l'id du choix fait par le player
      socket.emit('submit-choice', {choices:this.choices, playerChoice:idChoice})
      console.log(this.choices, idChoice)

      //on reinitialise le choix
      this.selectedChoiceId = -1
      this.choiceIsSubmitted= true

      //on enlève le pointer hover
      this.$refs['choiceSelection'][0].style.cursor = "auto"
      this.$refs['choiceSelection'][1].style.cursor = "auto"
    },
    selectChoice: function(index){
      if(!this.choiceIsSubmitted){ //on vérifie qu'on a pas déjà envoyé une réponse
        this.keepChoiceIdInMemory = index
        console.log(this.keepChoiceIdInMemory)
        if(this.selectedChoiceId==index){ //le choix est déjà sélectionné, donc on le désélectionne
          this.selectedChoiceId=-1
          this.keepChoiceIdInMemory = -1
          this.$refs['choiceSelection'][0].querySelector("img").classList.remove("discarded")
          this.$refs['choiceSelection'][1].querySelector("img").classList.remove("discarded")
        }
        else{ //sinon on sélectionne le choix
          this.selectedChoiceId = index
          if(index==0){
            this.$refs['choiceSelection'][1].querySelector("img").classList.add("discarded")
            this.$refs['choiceSelection'][0].querySelector("img").classList.remove("discarded")
            }
          else if (index==1){
            this.$refs['choiceSelection'][0].querySelector("img").classList.add("discarded")
            this.$refs['choiceSelection'][1].querySelector("img").classList.remove("discarded")
            }
          
          //console.log('CHANGE SELECT ID', this.selectedChoiceId)
        }
      }
    },
    resetAllData: function(){
        this.waitingMode = true
        this.displayResult= false

        this.choices = []
        this.idQuestion = null
        this.IsChoice1Disabled= true
        this.displayResult= false

        this.finalChoice=[]
        this.allVotes=0
        this.winner={}
        this.percentage=0
        this.parameters=[]
        this.selectedChoiceId= -1
        this.choiceIsSubmitted=false
        this.isTimerDone= false
        this.winnerID= -1
        this.choiceId= -1
        this.keepChoiceIdInMemory= -1
        //console.log('resetdata')
    },
    delay: function(ms){
      return new Promise(res => setTimeout(res, ms))
    },
    justWait : async function (){
      console.log("Wait 3s");
      const wewait = await this.delay(3000);
      console.log("you Waited 3s");
      socket.emit('who-is-the-winner')
    },
  }
}
</script>
