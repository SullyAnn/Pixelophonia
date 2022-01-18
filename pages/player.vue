<template>
  <section id = "choicePageContent">

        <div id ="orBlock">
            <p >OU</p>
        </div>
       
      <div v-for="(data, index) in choices" :key="index" class="choice">
          <h1 v-if="index == 0" style="right:0; top:0;" >{{data.title}}</h1>
          <h1 v-else style="left:0; bottom:0;" >{{data.title}}</h1>
          <img :id="index" v-on:click="sendChoice(index)"  <img :src="require('assets/images/'+data.img)"> alt="image test">
      </div>

  </section>
</template>

<script>
import "../assets/css/playerChoice.css";
import socket from '~/plugins/socket.io.js'
export default {
  asyncData () {
    return new Promise(resolve =>{
      socket.emit('last-choices', choices => resolve({ choices })) // on récupère le tableau créé dans server.js
    })
  },
  data () {
     return { idQuestion : null,
       IsChoice1Disabled: true
    }
  },
  head: {
    title: 'Nuxt.js with Socket.io'
  },
  watch: {
    
  },
  beforeMount () {
    socket.on("reload-this-page", (isReload) =>{
      //alert("reload la page player")
      location.reload(true)
    })
    socket.on('broadcast-question', (questiondata) => {
        this.choices = []
        this.idQuestion = questiondata.id
        for (const [key, value] of Object.entries(questiondata)) {
          this.choices.push(value)
        }
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
    }
  }
}
</script>
