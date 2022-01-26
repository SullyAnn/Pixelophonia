<!-- Voir le concert selon l'ID -->
<template>
<div>
    <AdminHeader />
    <h1>Voir le concert</h1>
    <h2>{{ concert.concert.title }} </h2>
    <h3>Questions du concert</h3>
    <ul class="questionsContainer">
    <li class="oneQuestion" v-for="(question, index) in questions" :key="index" @click="toggleInfos(`infos_${question.id}`)">
        <p class="elementViewConcert"> <b>{{question.label}}</b> <br /> <i>{{question.question}}</i>
        </p>

        <!-- <div class="displayInfos" :id="`infos_${question.id}`">
            {{question.question}}
            {{question.choices[0].title}}
            {{question.choices[1].title}}
        </div> -->
    </li>
    </ul>

    <NuxtLink :to="`${concert.concert.id}/update`">
        <button class="btn update">
            <svg class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M846.8 255L744.5 152.8c-33.1-33.1-87.9-33.1-122.5 0L149.6 625.3c-10.1 10.1-15.8 24.5-15.8 38.9L128 814v4.3c1.4 15.8 7.2 30.2 18.8 40.3 10.1 10.1 24.5 14.4 38.9 14.4h2.9l146.9-5.8c14.4 0 27.3-7.2 37.4-17.3l472.5-472.4c36-34.6 36-89.3 1.4-122.5z m-675 574.3l4.4-124.3 118.3 118.3-122.7 6z m181.1-34.5L204.7 646.7 597 254.4l148.2 148.2-392.3 392.2z m465.8-465.5l-31.5 31.4-148.4-148.2 31.6-31.4c6-6 13.5-9 21-9s15 3 21 9l106.3 106.3c11.9 11.9 11.9 29.9 0 41.9zM907.9 819.8H457.4c-16.6 0-30 13.4-30 30s13.4 30 30 30h450.5c16.6 0 30-13.4 30-30s-13.4-30-30-30zM497.9 769.6c0 16.6 13.4 30 30 30h380c16.6 0 30-13.4 30-30s-13.4-30-30-30h-380c-16.5 0-30 13.4-30 30z" />
            </svg>
        </button>
        Modifier le concert
    </Nuxtlink>

    <NuxtLink to="./" class="creationGoBackContainer">
      <div class="goBack">
        <button class="btn back">
          <svg class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M810.666667 554.666667H213.333333c-25.6 0-42.666667-17.066667-42.666666-42.666667s17.066667-42.666667 42.666666-42.666667h597.333334c25.6 0 42.666667 17.066667 42.666666 42.666667s-17.066667 42.666667-42.666666 42.666667z" />
            <path
              d="M512 853.333333c-12.8 0-21.333333-4.266667-29.866667-12.8l-298.666666-298.666666c-17.066667-17.066667-17.066667-42.666667 0-59.733334l298.666666-298.666666c17.066667-17.066667 42.666667-17.066667 59.733334 0s17.066667 42.666667 0 59.733333L273.066667 512l268.8 268.8c17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 8.533333-17.066667 12.8-29.866667 12.8z" />
          </svg>
        </button>
        Retour
      </div>
    </Nuxtlink>
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
        }
    }
  }
</script>

