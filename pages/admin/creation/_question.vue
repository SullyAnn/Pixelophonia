<template>
  <div>
    <h1>{{ this.label }}</h1>

    <form @submit.prevent="handleSubmit">
        <input v-model="label" type="text" name="label" required></input>
        <textarea v-model="question" placeholder="Question" required></textarea>

        <h2>Choix 1</h2>
        <input v-model="choices[0].title" type="text" name="title1" placeholder="Titre" required></input>
        <input v-model="choices[0].img" type="text" name="img1" placeholder="Titre" required></input>

        <h2>Choix 2</h2>
        <input v-model="choices[1].title" type="text" name="title2" placeholder="Titre" required></input>
        <input v-model="choices[1].img" type="text" name="img2" placeholder="Titre" required></input>

        <button type="submit">Modifier</button>
    </form>

    <NuxtLink to="./">Back to questions</NuxtLink>
  </div>
</template>

<script>
  export default {
    async asyncData({ params }) {
      //va chercher les infos de la question et de ses choix
      const question = await fetch(
      `http://localhost:3000/api/question/${params.question}`
      ).then((res) => res.json())

      console.log(question)

      return question
    },
    methods: {
      //envoie le formulaire : update les données de la question et de ses choix
      handleSubmit: async function (e) {
        e.preventDefault()
        const body = {
          label: this.label,
          question: this.question,
          title1: this.choices[0].title,
          img1: this.choices[0].img,
          id1: this.choices[0].id,
          title2: this.choices[1].title,
          img2: this.choices[1].img,
          id2: this.choices[1].id,
        }
        await fetch(`http://localhost:3000/api/question/${this.id}`, { 
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)})
          .catch(error => { console.log(error) });
        this.$router.push('./')
      },
    },
}
</script>