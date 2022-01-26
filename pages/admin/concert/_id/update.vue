<!-- Update le concert selon l'ID -->

<template>
  <div>
    <AdminHeader />
    <div class="window">
      <h2>Modifier le concert : {{ concert.concert.title }}</h2>
      <form @submit.prevent="handleSubmit">
        <input type="text" v-model="concert.concert.title" placeholder="Titre du concert" class="labelChoice">


        <h3> Questions à inclure au concert </h3>
        <div class="allQuestionsToCheck">
          <div v-for="(question, index) in allQuestions" :key="index" class="containsCheckQuestion">
            <input type="checkbox" :id="`question_${question.id}`" class="checkQuestion">
            <label :for="`question_${question.id}`">{{question.label}}</label>
          </div>
        </div>
        <input type="submit" value="ok" class="btn send">
      </form>
      <NuxtLink to=".">Annuler (sans sauvegarder)</NuxtLink>

    </div>
  </div>
</template>

<script>
import {getConcert, getQuestions, getQuestion, updateConcert} from "@/assets/classes/Admin.js"
  export default {
    async asyncData({ params, $axios }) {
      const id = params.id  // get the id of the concert
      try {

        const concert = await getConcert($axios, id)
        const allQuestions = await getQuestions($axios)

        const questionsInConcert = []
        for (let element of concert.questions) {
        // add to questions all questions contained in concert
            questionsInConcert.push(await getQuestion($axios, element.questionId))
        }
        return { concert, questionsInConcert, allQuestions }
      }
      catch (error) {
          console.log(error)
      }
    },

    mounted() {
        this.verifCheck()
    },
    methods: {
        verifCheck: function() {
            this.allQuestions.forEach(element => {
                for (let elem of this.concert.questions) {
                    if (elem.questionId == element.id) {
                        // let monid = element.id.toString()
                        document.getElementById("question_"+element.id.toString()).checked = true
                        console.log("question_"+element.id.toString())
                    }
                    else {
                        // document.getElementById("question_"+element.id.toString()).checked = false
                    }
                }  
            });    
        },
        handleSubmit: async function (e) {
            e.preventDefault()
            let tabCheckedQuestions = []

            this.allQuestions.forEach(element => {
                if (document.getElementById("question_"+element.id.toString()).checked == true)
                {
                    tabCheckedQuestions.push(element)
                }
            });

            const body = {
                title: this.concert.concert.title,
                questions: tabCheckedQuestions,
            }
            await updateConcert(this.$axios, this.concert.concert.id, body)
            this.$router.push('.')
        }
    },
  }
</script>
