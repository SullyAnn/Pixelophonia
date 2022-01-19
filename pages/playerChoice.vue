<template>
    <section id = "choicePageContent">
        <client-only>
        <div id ="orBlock">
            <p >OU</p>
        </div>
        <div  id ="choicesDiv">
            <div class="choice" v-for ="(choice,index) in choices" :key="choice.id">
                <!--doit correspondre au libellé du choix n°1 de la question-->
                <h1 v-if="index == 0" style="right:0; top:0;" >{{choice.label}}</h1>
                <h1 v-else style="left:0; bottom:0;" >{{choice.label}}</h1>
                <!--doit correspondre au lien de l'image du choix n°1 de la question-->
                <a :id="index" v-if="index==0" @click="blur(choice,index)" v-on:click="sendChoice(index)" alt="image test"> <img :src="require('assets/images/'+data.img)"></a>
                <a :id="index" v-else @click="blur(choice,index)"  v-on:click="sendChoice(index)" alt="image test" > <img :src="require('assets/images/'+data.img)"></a>-->
            </div>   
        </div>
        </client-only>


    </section>
</template>

<script>
import socket from '~~/plugins/socket.io.js'
import "@/assets/css/playerChoice.css";



export default {
    name: "homePages",
    layout : "",
    asyncData () {
    return new Promise(resolve =>{
      socket.emit('last-choices', choices => resolve({ choices })) // on récupère le tableau créé dans server.js
    })
  },
    data(){
        return{
            // label = question.choice[0].label pour choix 1 par exemple
            // url = question.choice[0].url 
            choices: [
                { label:"EN VILLE", url:"city.png"},
                { label : "DANS LES MARAIS", url: "marais.jpg"}
            ],
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
        if(choice.yourchoice == 0)  document.getElementById("0").style.filter = "grayscale(1) blur(5px)"
        else if(choice.yourchoice == 1)  document.getElementById("1").style.filter = "grayscale(1) blur(5px)"
        //console.log("IsChoice1Disabled = " + this.IsChoice1Disabled)
        
    })
  },
   mounted () {
  },
    methods: {
        
        blur : function(test1,id){
            let newId = 0
            if(id==0){
                newId = 1 
            }
            const test = document.getElementById(newId);
            test1=test
            test1.style.filter="grayscale(1)"     
        },
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
