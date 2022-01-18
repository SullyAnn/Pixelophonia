<template>
  <div>
    <h1>{{ question.label }}</h1>

    <form action="localhost:3000/api/upload.php" class="form" @submit.prevent="handleSubmit" method="post">
        <input v-model="question.label" type="text" name="label" required></input>
        <textarea v-model="question.question" placeholder="Question" required></textarea>

        <h2>Choix 1</h2>
        <input v-model="question.choices[0].title" type="text" name="title1" placeholder="Titre" required></input>
        <input v-on:change="getImg1" type="file" accept="image/*" name="img1"  required></input>

        <h2>Choix 2</h2>
        <input v-model="question.choices[1].title" type="text" name="title2" placeholder="Titre" required></input>
       <input v-on:change="getImg2" type="file" accept="image/*" name="img2" required></input>

        <button type="submit">Modifier</button>
    </form>


    <NuxtLink to="./">Back to questions</NuxtLink>
  </div>
</template>

<script>
import {getQuestion, updateQuestion, addImageFile} from "@/assets/classes/Admin.js"
import XHRUpload from '@uppy/xhr-upload'
import Uppy from '@uppy/core'
  export default {
    async asyncData({ params, $axios }) { //va chercher les données de la question et les garde dans les datas (dans question[]) avant de render la page (du côté du serveur)
      //const question = await $axios.$get(`api/question/${params.question}`)
      const question = await getQuestion($axios, params.question)
      return {question}
    },
    data(){
      return{
        //form: FormData,
      }
    },
    methods: {
      //envoie le formulaire : update les données de la question et de ses choix
      handleSubmit: async function (e) {
        e.preventDefault()
        const form = new FormData()
        form.append('img1', this.question.choices[0].img)
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
        //this.form.push({img1 : this.img1.name}, {img2: this.img2.name})
        console.log(form)
        await updateQuestion(this.$axios, this.question.id, body)
        
        const uppy = new Uppy({ debug: true, autoProceed: true })
        uppy.use(XHRUpload, {
          endpoint: 'localhost:3000/api/upload.php',
          fieldName: 'img1',
        })
        
        // And display uploaded files
        uppy.on('upload-success', (file, response) => {
          console.log(file)
          const url = response.uploadURL
          const fileName = file.name
          console.log("successful upload of the filename" + fileName)
        })
        
        //await addImageFile(this.$axios, this.form)
        this.$router.push('./')
      },
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