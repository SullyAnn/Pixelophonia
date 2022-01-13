<template>
  <div>
    <ul>
      <li v-for="(question, index) in questions" :key="index">
        {{ question.label }} ; {{ question.question }}
        <NuxtLink :to="`${question.id}`">Modifier {{question.id}}</NuxtLink>
        <button v-on:click="deleteQuestion(question.id)" >Supprimer</button>
      </li>
    </ul>

    <NuxtLink to="./AjoutQuestion">Ajouter une question</NuxtLink>

  </div>
</template>

<script>
  export default {
    name: 'QuestionList',
    created(){
       console.log(this.$route.path); // path is /users
    },
    async asyncData() {
      const questions = await fetch(
        "http://localhost:3000/api/questions", {method: 'GET'}
      ).then((res) => res.json())
      return {questions}
    },
    methods: {
        deleteQuestion: async function (idQuestion) {
          await fetch('http://localhost:3000/api/question/'+idQuestion, {method: 'DELETE'}).catch(error => { console.log(error) })
          this.$router.go(0) //refresh page
        },
    },
  }
</script>