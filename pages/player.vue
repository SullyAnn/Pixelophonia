<template>
  <div>
      <div v-for="(data, index) in choices" :key="index" class="question">
          <img :id="index+1" v-on:click="sendChoice(index+1)" :src="data.img" alt="image test">
      </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        if(choice.yourchoice == 1)  document.getElementById("1").style.filter = "grayscale(1) blur(5px)"
        else if(choice.yourchoice == 2)  document.getElementById("2").style.filter = "grayscale(1) blur(5px)"
        //console.log("IsChoice1Disabled = " + this.IsChoice1Disabled)
        
    })
  },
  mounted () {
  },
  methods: {
    sendChoice: function(idChoice){
        
      if(!this.IsChoice1Disabled){return} // trouver une meilleure solution pour désactiver event click sur les images
      console.log("vous avez cliqué sur l'image " + idChoice)

      //console.log(this.choices)
      this.choices.find(element => element.id == idChoice).nbvotes++
      
      // transmission des choix possibles et de l'id du choix fait par le player
      socket.emit('submit-choice', {choices:this.choices, playerChoice:idChoice})
    }
  }
}
</script>

<style>
.chatArea{
    display:flex;
    justify-content:center;
}
.images{

}
</style>