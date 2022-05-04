<template>
  <div>
    <AdminHeader />
    <div id="addQuestion" class="window">
      <h2>Ajouter une question</h2>

      <FormQuestion type="add"/>
      <NuxtLink to="./">Revenir à la liste (sans sauvegarder)</NuxtLink>
    </div>
  </div>
</template>

<script>
import {
  addQuestion,
  updateUploadImage,
  updateQuestion,
} from "@/assets/classes/Admin.js";
import "@/assets/css/admin.css";

export default {
  name: "QuestionForm",
  data() {
    return {
      label: "",
      textQuestion: "",
      temps: null,
      title1: "",
      img1: [],
      title2: "",
      img2: [],
      file: "",
    };
  },
  methods: {
    // formulaire d'ajout de question
    handleSubmit: async function (e) {
      e.preventDefault();

      this.img1 = document.getElementById("image1").files[0];
      this.img2 = document.getElementById("image2").files[0];

      //gestion du temps
      let tempsInDB = 0;
      if (this.temps) tempsInDB = this.temps;

      //----------------

      const body = {
        label: this.label,
        textQuestion: this.question,
        temps: tempsInDB,
        title1: this.title1,
        img1: this.img1.name,
        title2: this.title2,
        img2: this.img2.name,
      };

      // ajout de la question + récup de la liste de toutes les questions
      const questions = await addQuestion(this.$axios, body);

      // upload de l'image associée à la question
      this.uploadImages(questions, tempsInDB);
      
      // retour à la liste des questions
      this.$router.push("./"); 
    },

    uploadImages: async function (questions, tempsInDB) {
      console.log("AH")
      // récupère la dernière question
      let lastQuestion =
        questions[Object.keys(questions)[Object.keys(questions).length - 1]];

      // extensions des fichiers
      const extension1 = lastQuestion.choices[0].img.split(".");
      const extension2 = lastQuestion.choices[1].img.split(".");

      // rename les fichiers en fonction de l'id
      lastQuestion.choices[0].img = `q${lastQuestion.id}_c${lastQuestion.choices[0].id}.${extension1[1]}`;
      lastQuestion.choices[1].img = `q${lastQuestion.id}_c${lastQuestion.choices[1].id}.${extension2[1]}`;

      const bodyChanged = {
        img1: lastQuestion.choices[0].img,
        id1: lastQuestion.choices[0].id,
        img2: lastQuestion.choices[1].img,
        id2: lastQuestion.choices[1].id,
        temps: tempsInDB,
      };

      // update la question avec les bonnes valeurs d'images
      await updateQuestion(this.$axios, lastQuestion.id, bodyChanged);

      // enregistrement des images dans le dossier assets/images du projet
      const form = new FormData();
      form.append("img1", this.img1);
      form.append("img2", this.img2);
      form.append("idQuestion", lastQuestion.id);
      form.append("idChoice1", lastQuestion.choices[0].id);
      form.append("idChoice2", lastQuestion.choices[1].id);

      await updateUploadImage(this.$axios, form);
    },

    previewFile: function (id, idFile) {
      var preview = document.getElementById(id);
      var file = document.getElementById(idFile).files[0];
      var reader = new FileReader();

      reader.onloadend = function () {
        preview.src = reader.result;
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        preview.src = document.getElementById(id).src;
      }
    },
  },
};
</script>