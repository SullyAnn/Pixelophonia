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
              <img :src="require(`assets/images/${question.choices[0].img}`)" id="display1" />
            </label>
        </fieldset>

        <fieldset>
            <legend>Choix n°2</legend>
            <input v-model="question.choices[1].title" type="text" name="title2" placeholder="Titre" class="labelChoice" required> 

            <input v-on:change="previewFile('display2', 'image2')" type="file" accept="image/*" name="img2" id="image2" style="display:none;">
            <label for="image2" class="importImg" >
              <img :src="require(`assets/images/${question.choices[1].img}`)"  id="display2" />
            </label>
        </fieldset>
        </div>

        <input type="submit" value="ok" class="btn send">
    </form>

    <NuxtLink to="./creation">Revenir à la liste (sans sauvegarder)</NuxtLink>
  </div>
</template>

<script>
import {getQuestion, updateQuestion} from "@/assets/classes/Admin.js"

  export default {
	/* va chercher les données de la question et les garde dans les datas (dans question[]) 
	   avant de render la page (du côté du serveur) */
    async asyncData({ params, $axios }) { 
		//const question = await $axios.$get(`api/question/${params.question}`)
		const question = await getQuestion($axios, params.question)
		return {question}
    },
    methods: {

	// ========= BACK ========== //

		// send form : update question & choices
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
		await updateQuestion(this.$axios, this.question.id, body)
		this.$router.push('./creation')
		},

	// ========= FRONT ========= //

		// preview images before sending form
		previewFile : function(id, idFile) {
			var preview = document.getElementById(id)
			var file    = document.getElementById(idFile).files[0]
			var reader  = new FileReader()

			reader.onloadend = function () {
				preview.src = reader.result
			}

			if (file) { reader.readAsDataURL(file)} 
			else {preview.src =  document.getElementById(id).src}
		},      
    },
}
</script>