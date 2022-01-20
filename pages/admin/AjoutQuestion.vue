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
import {addQuestion, getQuestions, updateUploadImage, updateQuestion} from "@/assets/classes/Admin.js"

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
        file:'',
        form: [],
    }
  },
  methods: {
      //envoie le formulaire d'ajout de question : create une question et ses deux choix
    handleSubmit: async function (e) {
      e.preventDefault()
      this.form.push({img1 : this.img1.name, img2: this.img2.name})
      this.img1 = document.getElementById("image1").files[0];
      this.img2 = document.getElementById("image2").files[0];

      const body = {
        label: this.label,
        question: this.question,
        title1: this.title1,
        img1: this.img1.name,
        title2: this.title2,
        img2: this.img2.name,
      }
      console.log("avant addQuestions")
      const questions = await addQuestion(this.$axios, body)
      console.log("après addQuestion")
      //const questions = await getQuestions(this.$axios)

      //on récupère la dernière question ajoutée pour en récupérer l'id
      console.log(questions)
      console.log(questions[Object.keys(questions)[Object.keys(questions).length-1]])
      let lastAddedQuestion = questions[Object.keys(questions)[Object.keys(questions).length-1]]

      const extension1 = (lastAddedQuestion.choices[0].img).split('.')
      const extension2 = (lastAddedQuestion.choices[1].img).split('.')
      lastAddedQuestion.choices[0].img = `q${lastAddedQuestion.id}_c${lastAddedQuestion.choices[0].id}.${extension1[1]}`
      lastAddedQuestion.choices[1].img = `q${lastAddedQuestion.id}_c${lastAddedQuestion.choices[1].id}.${extension2[1]}`

      const bodyChanged = {
          img1: lastAddedQuestion.choices[0].img,
          id1: lastAddedQuestion.choices[0].id,
          img2: lastAddedQuestion.choices[1].img,
          id2: lastAddedQuestion.choices[1].id,
        }

       const question = await updateQuestion(this.$axios, lastAddedQuestion.id, bodyChanged)
      console.log(question)
      
      // enregistrement des images dans le dossier image du projet 
      const form = new FormData()
      console.log(this.img2)
      console.log(this.img1.name)
      form.append('img1', this.img1)
      form.append('img2', this.img2)
      form.append('idQuestion', lastAddedQuestion.id)
      form.append('idChoice1',lastAddedQuestion.choices[0].id)
      form.append('idChoice2',lastAddedQuestion.choices[1].id)
      await updateUploadImage(this.$axios, form) 

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