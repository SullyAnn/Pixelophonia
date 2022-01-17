<template>
<div>
  host
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
      parameters:[]
    }
  },
  head: {
    title: 'Nuxt.js with Socket.io'
  },
  watch: {
  },
  beforeMount () {
    // ici on récupère la question
    socket.on('display-question-on-screen', (questiondata)=> {
        console.log(questiondata)
        this.displayQuestionData.push(questiondata)
    }),
    // ici on récupère les images des choix de la question 
    socket.on('broadcast-question', (questiondata) => {
      console.log(questiondata)
        for (const [key, value] of Object.entries(questiondata)) {
          this.displayQuestionData.push(value)
          //console.log(value)
        }
    })
    socket.on('display-final-choice', (choice) => {
       this.parameters = []
      // la variable choice est un objet contenant un objet "totalVotes" et un autres "choices" (celui ci contient toutes les instances de choices existantes pour cette question)
        console.log("maintenant on est dans le 'display-final-choice du grand écran" )
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
</style>