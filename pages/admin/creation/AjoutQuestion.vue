<template>
  <div>
    <form @submit.prevent="handleSubmit">
        <input v-model="label" type="text" name="label" placeholder="Label" required></input>
        <textarea v-model="question" placeholder="Question" name="question" required></textarea>

        <h2>Choix 1</h2>
        <input v-model="title1" type="text" name="title1" placeholder="Titre" required></input>
        <input v-on:change="getImg1" type="file" accept="image/*" name="img1" required></input>

        <h2>Choix 2</h2>
        <input v-model="title2" type="text" name="title2" placeholder="Titre" required></input>
        <input v-on:change="getImg2" type="file" accept="image/*" name="img2" required></input>


        <button type="submit">Ajouter</button>
    </form>

    <NuxtLink to="./">Back to questions</NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'QuestionForm',
  data() {
    return { 
        label: '',
        question: '',
        title1: '',
        img1: [],
        title2: '',
        img2: [],
    }
  },
  methods: {
      //envoie le formulaire d'ajout de question : create une question et ses deux choix
    handleSubmit: async function (e) {
      e.preventDefault()
      const body = {
        label: this.label,
        question: this.question,
        title1: this.title1,
        img1: this.img1.name,
        title2: this.title2,
        img2: this.img2.name,
      }
      //crée la question avec ses choix avec post(urlApi, data, configHeader)
      await this.$axios.$post(`api/question`, JSON.stringify(body), {headers: { 'Content-Type': 'application/json' }})
      .catch(error => { console.log(error) }); 

      this.$router.push('./') //on revient à la page de liste des questions
    },
    //met dans la variable img le fichier que l'utilisateur est allé chercher
    getImg1() {
        console.log(event.target.files[0]);
        this.img1 = event.target.files[0];
    },
    getImg2() {
        console.log(event.target.files[0].name);
        this.img2 = event.target.files[0];
    },      
  },
}
</script>