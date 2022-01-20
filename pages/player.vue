<template>
  <section>
    <div v-show="isQuestionDisplayed==true" id="choicePageContent">
      <div v-if="!displayResult" class="container">
        <div id="orBlock">
          <p>OU</p>
        </div>

        <div v-for="(data, index) in choices" :key="index" class="choice">
          <h1 v-if="index == 0" style="right:0; top:0;">{{data.title}}</h1>
          <h1 v-else style="left:0; bottom:0;">{{data.title}}</h1>
          <img :id="index" v-on:click="sendChoice(index)"
            :src="require(`assets/images/Question_${idQuestion}/`+data.img)" alt="image test">
        </div>
      </div>

      <div v-else>
        <img :src="require(`assets/images/Question_${idQuestion}/`+this.parameters[0].winner)" alt="image test">
      </div>

    </div>

    <div v-show="isQuestionDisplayed==false" id="homePageContent">
      <div id="logoLong">
        <img id="imageLogoLong" src="@/assets/images/logoLong.png">
      </div>

      <div class="">
        <p v-if="affichage ==0"> Bienvenue sur l'application Pixélophonia,
          <br>L'ochestre ne propose aucun jeu pour le moment.
        </p>
        <p v-else-if="affichage==1"> Bienvenue sur l'application Pixélophonia,
          <br> Attendez les instructions du chef d'ochestre pour pouvoir voter </p>
        <p v-else-if="affichage==2"> Merci pour votre participation! </p>
      </div>
    </div>

  </section>
</template>

<script>
import socket from '~/plugins/socket.io.js';
import "../assets/css/playerChoice.css";
import "../assets/css/playerHomePages.css";

export default {
  asyncData () {
    return new Promise(resolve =>{
        socket.emit('last-choices', choices => resolve({ choices })) // on récupère le tableau créé dans server.js
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
       affichage : 0
    }
  },
  head: {
    title: 'Joueur'
  },
  watch: {
    
  },
  beforeMount () {

    

    socket.on("reload-this-page", (isReload) =>{
      //alert("reload la page player")
      location.reload(true)
    })
     socket.on('broadcast-menu', (displayStatus) => {
      console.log("test")
      this.isQuestionDisplayed = false
      this.affichage = displayStatus
    })
  
    socket.on('broadcast-question', (questiondata) => {
        if (this.waitingMode){this.waitingMode = false} //comme on a lancé une question on est plus en waitingMode
        this.choices = []
        this.idQuestion = questiondata.id
        // for (const [key, value] of Object.entries(questiondata)) {
        //   this.choices.push(value)
        // }
        this.choices = Object.values(questiondata.choices)
        console.log(this.choices)
        this.isQuestionDisplayed = true
    })
    socket.on('display-player-choice', (choice) => {
        console.log("maintenant on est dans le display-player-choice du client " + choice.yourchoice )
        // on empêche le player de changer de vote (ça bloque les événements sur le click)
        this.IsChoice1Disabled = false;
        // effet grisé une fois une image sélectionnée
        if(choice.yourchoice == 0)  {
          document.getElementById("1").style.filter = "grayscale(1)"
          document.getElementById("0").style.filter="brightness(1.25)"}
        else if(choice.yourchoice == 1){ 
        document.getElementById("0").style.filter = "grayscale(1)"
        document.getElementById("1").style.filter="brightness(1.25)"
        } 
        //console.log("IsChoice1Disabled = " + this.IsChoice1Disabled)
        
    }),
    socket.on('display-final-choice', (totalvotes, winner, percentage) => {
      
      console.log('DISPLAY LE RESULTAT')
      this.displayResult = true

      this.parameters = []

      this.parameters.push({totalvote:totalvotes,winner:winner.img, percentage:Math.floor(percentage)+"%" })
       
    }),
    socket.on('stop-partie', () => {
      this.resetAllData()
      this.isQuestionDisplayed = false
      this.affichage = 0
    }),
    socket.on('stop-question', (displayStatus) => {
      this.resetAllData()
      this.isQuestionDisplayed = false
      this.affichage = displayStatus

    })
  
  },
  mounted () {
    
  },
  methods: {
    sendChoice: function(idChoice){
        
      if(!this.IsChoice1Disabled){return} // trouver une meilleure solution pour désactiver event click sur les images
      console.log("vous avez cliqué sur l'image " + idChoice)
      const idPlayerChoice = Object.values(this.choices).at(idChoice).id
      //console.log(this.choices)

      this.choices.find(element => element.id == idPlayerChoice).nbvotes++
      //console.log(Object.values(this.choices).at(0).nbvotes)

      // transmission des choix possibles et de l'id du choix fait par le player
      socket.emit('submit-choice', {choices:this.choices, playerChoice:idChoice})
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
        //console.log('resetdata')
    }
  }
}
</script>
