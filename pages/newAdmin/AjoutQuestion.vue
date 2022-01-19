<template>
<div id="addQuestion" class="window">
    <h2>Ajouter une question</h2>
    <form @submit.prevent="handleSubmit">
        <input v-model="label" type="text" name="label" placeholder="Libellé de la question" class="labelChoice" required>
        <textarea v-model="question" placeholder="Question" name="question" class="labelChoice" required></textarea>

        <div class="choices2">
        <fieldset>
            <legend>Choix n°1</legend>
            <input v-model="title1" type="text" name="title1" placeholder="Titre" class="labelChoice" required>
            <input v-on:change="getImg1(), previewFile('display1', 'image1')" type="file" accept="image/*" name="img1" id="image1" style="display:none;" required>
            <label for="image1" class="importImg" >
              	<img src="@/assets/images/addPic.jpg" width="200" id="display1" />
            </label>
        </fieldset>

        <fieldset>
            <legend>Choix n°2</legend>
            <input v-model="title2" type="text" name="title2" placeholder="Titre" class="labelChoice" required>
            <input v-on:change="getImg2(), previewFile('display2', 'image2')" type="file" accept="image/*" name="img2" id="image2" style="display:none;" required>
            <label for="image2" class="importImg" >
              <img src="@/assets/images/addPic.jpg" width="200" id="display2" />
            </label>
        </fieldset> 
        </div>

        <input type="submit" value="ok" class="btn send">
    </form>

    <NuxtLink to="./creation">Revenir à la liste (sans sauvegarder)</NuxtLink>
</div>
</template>

<script>
import {addQuestion} from "@/assets/classes/Admin.js"
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
      await addQuestion(this.$axios, body)

      this.$router.push('./creation') //on revient à la page de liste des questions
    },

    previewFile : function(id, idFile) {
		var preview = document.getElementById(id)
		var file    = document.getElementById(idFile).files[0]
		var reader  = new FileReader()

		reader.onloadend = function () {
		preview.src = reader.result
		}

		if (file) { reader.readAsDataURL(file) }
		else { 
			preview.src =  document.getElementById(id).src		
		} // TO DO : changer ça  
      
    },

    // met dans la variable img le fichier que l'utilisateur est allé chercher
    
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