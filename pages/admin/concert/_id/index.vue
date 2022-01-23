<!-- Voir le concert selon l'ID -->
<template>
<div>
    <h1>Voir le concert</h1>
    <h2>Titre : {{ concert.concert.title }}</h2>
    <div v-for="(question, index) in questions" :key="index" @click="toggleInfos(`infos_${question.id}`)">
        <p> {{question.label}}</p>
        <div :id="`infos_${question.id}`" style="display:none;">
            {{question.question}}
            <!-- vérifier que les choices existent / s'en assurer -->
            <!-- {{question.choices[0].title}}
            {{question.choices[1].title}} -->
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
            if (document.getElementById(id).style.display == "block") {
                document.getElementById(id).style.display="none"
            }
            else {
                document.getElementById(id).style.display="block"
            }
        }
    }
  }
</script>

