<template>
  <div>
    <h1>{{ this.label }}</h1>

    <form @submit.prevent="handleSubmit">
        <input v-model="label" type="text" name="label" value=this.label required></input>
        <textarea v-model="question" placeholder="Question" value=this.question required></textarea>
        <button type="submit">Modifier</button>
    </form>

    <NuxtLink to="./">Back to questions</NuxtLink>
  </div>
</template>

<script>
  export default {
    async asyncData({ params }) {
      const question = await fetch(
      `http://localhost:3000/api/question/${params.question}`
      ).then((res) => res.json())

      return question
    },
    methods: {
      handleSubmit: async function (e) {
        e.preventDefault()
        const body = {
          label: this.label,
          question: this.question,
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