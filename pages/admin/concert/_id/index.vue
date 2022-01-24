<!-- Voir le concert selon l'ID -->
<template>
<div class="window">
    <h1>Voir le concert</h1>
    <h2>Titre : {{ concert.concert.title }}</h2>
    
    <div class="questionsContainer">
    <div v-for="(question, index) in questions" :key="index" @click="toggleInfos(`infos_${question.id}`)">
        <p> {{question.label}}</p>
        <div class="toggleInfos" :id="`infos_${question.id}`">
            {{question.question}}
            <!-- vérifier que les choices existent / s'en assurer -->
            <!-- {{question.choices[0].title}}
            {{question.choices[1].title}} -->
        </div>
    </div>
    </div>
    <NuxtLink :to="`${concert.concert.id}/update`"> Modifier</Nuxtlink>
    <NuxtLink to="./"> Retour</Nuxtlink>
</div>
</template>

<script>
import {getConcert, getQuestion} from "@/assets/classes/Admin.js"

export default {
    async asyncData({ params, $axios }) {
      const id = params.id  // get the id of the concert
      try {
        const concert = await getConcert($axios, id)
        const questions = []

for (let element of concert.questions) {
        // add to questions all questions contained in concert
            questions.push(await getQuestion($axios, element.questionId))
        }
        console.log(questions)
        console.log(concert)
          return { concert, questions }
      }
      catch (error) {
          console.log(error)
      }
    },
    methods: {
        toggleInfos: function(id) {
            if (document.getElementById(id).style.opacity == "100") {
                document.getElementById(id).style.opacity == "0"
            }
            else {
                document.getElementById(id).style.opacity == "100"
            }
        }
    }
  }
</script>

