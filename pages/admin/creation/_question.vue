<template>
  <div>
    <h1>{{ question.label }}</h1>

    <form @submit.prevent="handleSubmit">
        <input v-model="question.label" type="text" name="label" required></input>
        <textarea v-model="question.question" placeholder="Question" required></textarea>

        <h2>Choix 1</h2>
        <input v-model="question.choices[0].title" type="text" name="title1" placeholder="Titre" required></input>
        <input v-model="question.choices[0].img" type="text" name="img1" placeholder="Titre" required></input>

        <h2>Choix 2</h2>
        <input v-model="question.choices[1].title" type="text" name="title2" placeholder="Titre" required></input>
        <input v-model="question.choices[1].img" type="text" name="img2" placeholder="Titre" required></input>

        <button type="submit">Modifier</button>
    </form>

    <NuxtLink to="./">Back to questions</NuxtLink>
  </div>
</template>

<script>
  export default {
    async asyncData({ params, $axios }) { //va chercher les données de la question et les garde dans les datas (dans question[]) avant de render la page (du côté du serveur)
      const question = await $axios.$get(`api/question/${params.question}`)
      console.log(question)
      return {question}
    },
    methods: {
      //envoie le formulaire : update les données de la question et de ses choix
      handleSubmit: async function (e) {
        e.preventDefault()
        const body = {
          label: this.question.label,
          question: this.question.question,
          title1: this.question.choices[0].title,
          img1: this.question.choices[0].img,
          id1: this.question.choices[0].id,
          title2: this.question.choices[1].title,
          img2: this.question.choices[1].img,
          id2: this.question.choices[1].id,
        }
        await this.$axios.$put(`api/question/${this.question.id}`, JSON.stringify(body), {headers: { 'Content-Type': 'application/json' }}).catch(error => { console.log(error) }); 
        this.$router.push('./')
      },
    },
}
</script>