<template>
  <div class="window">
    <h2>Modifier : {{ question.label }}</h2>

    <form @submit.prevent="handleSubmit">
        <input v-model="question.label" type="text" name="label"  class="labelChoice" required>
        <textarea v-model="question.question" placeholder="Question" class="labelChoice" required></textarea>

        <div class="choices2">
        <fieldset>
            <legend>Choix n°1</legend>
            <input v-model="question.choices[0].title" type="text" name="title1" placeholder="Titre" class="labelChoice" required> 

            <input v-on:change="previewFile('display1', 'image1')" type="file" accept="image/*" name="img1" id="image1" style="display:none;">
            <label for="image1" class="importImg" >
              <img :src="require(`assets/images/Question_${question.id}/${question.choices[0].img}`)" id="display1" />
            </label>
        </fieldset>

        <fieldset>
            <legend>Choix n°2</legend>
            <input v-model="question.choices[1].title" type="text" name="title2" placeholder="Titre" class="labelChoice" required> 

            <input v-on:change="previewFile('display2', 'image2')" type="file" accept="image/*" name="img2" id="image2" style="display:none;">
            <label for="image2" class="importImg" >
              <img :src="require(`assets/images/Question_${question.id}/${question.choices[1].img}`)"  id="display2" />
            </label>
        </fieldset>
        </div>


        <input type="submit" value="ok" class="btn send">

    </form>

    <NuxtLink to="./">Revenir à la liste (sans sauvegarder)</NuxtLink>
  </div>
</template>

<script>
import {getQuestion, updateQuestion, updateUploadImage} from "@/assets/classes/Admin.js"
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
      getImg1: function() {
          this.img1 = event.target.files[0];
      },
      getImg2: function() {
          this.img2 = event.target.files[0];
      },
      //envoie le formulaire : update les données de la question et de ses choix
      handleSubmit: async function (e) {
        e.preventDefault()
        this.img1 = document.getElementById("image1").files[0];
        this.img2 = document.getElementById("image2").files[0];
        if(this.img2 == null)this.img2 = {name:this.question.choices[1].img}
        if(this.img1 == null)this.img1 = {name:this.question.choices[0].img}
        const form = new FormData()
        console.log(this.img2)
        console.log(this.img1.name)
        form.append('img1', this.img1)
        form.append('img2', this.img2)
        form.append('idQuestion', this.question.id)
        form.append('idChoice1',this.question.choices[0].id)
        form.append('idChoice2',this.question.choices[1].id)

        const extension1 = (this.img1.name).split('.')
        const extension2 = (this.img2.name).split('.')
        console.log(extension2[1])

        const body = {
          label: this.question.label,
          question: this.question.question,
          title1: this.question.choices[0].title,
          img1: `q${this.question.id}_c${this.question.choices[0].id}.${extension1[1]}`,
          id1: this.question.choices[0].id,
          title2: this.question.choices[1].title,
          img2: `q${this.question.id}_c${this.question.choices[1].id}.${extension2[1]}`,
          id2: this.question.choices[1].id,
        }
        //this.form.push({img1 : this.img1.name}, {img2: this.img2.name})
        
        console.log(body)
        await updateQuestion(this.$axios, this.question.id, body) 
        await updateUploadImage(this.$axios, form)       
        // await this.$axios({
        //   method:'post',
        //   url:'http://127.0.0.1:3333/upload',
        //   data: form,
        //   config: {headers : {'content-type':'multipart/form-data'}}
        // })
        this.$router.push('./')
      },
      previewFile : function(id, idFile) {
        var preview = document.getElementById(id);
        var file    = document.getElementById(idFile).files[0];
        var reader  = new FileReader();

        reader.onloadend = function () {
          preview.src = reader.result;
        }

        if (file) {
          reader.readAsDataURL(file);
        } else {
          preview.src = "https://sdr-lab.u-pem.fr/cherrier.jpg"; // cliquez pour ajouter 
        }
        
      },
      // Factoriser ces fonctions pour qu'il n'y en ait plus qu'une   

    },
}
</script>