<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="label"
      type="text"
      name="label"
      placeholder="Libellé de la question"
      class="labelChoice"
      required
    />

    <textarea
      v-model="textQuestion"
      placeholder="Question"
      name="question"
      class="labelChoice"
      required
    ></textarea>

    <div class="tooltipWrapper">
      <input
        v-model="temps"
        type="number"
        name="temps"
        placeholder="Durée (en secondes)"
        class="labelChoice inputTime"
        min="0"
        step="1"
      />
      <span class="tooltipTime"
        >Laisser vide ou mettre zéro pour une question sans durée</span
      >
    </div>

    {{ title1 }}

    <div class="choices2">
      <FormImageField
        :idField="1"
        :idQuestion="idQuestion"
        :choice="choices[0]"
        v-model="title1"
      />
      <FormImageField
        :idField="2"
        :idQuestion="idQuestion"
        :choice="choices[1]"
        v-model="title2"
      />
    </div>
    <input type="submit" value="ok" class="btn send" />
  </form>
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

  props: {
    type: String,
    question: Object,
  },

  data() {
    return {
      // Question
      label: "",
      textQuestion: "",
      idQuestion: null,
      temps: null,

      // Choices
      choices: [],
      title1: "",
      title2: "",
      img1: [],
      img2: [],
    };
  },

  beforeMount() {
    // avant mounted pour éviter bug affichage
    if (this.type == "update") {
      this.choices = this.question.choices;
      this.idQuestion = this.question.id;
    }
  },

  mounted() {
    if (this.type == "update") {
      this.label = this.question.label;
      this.textQuestion = this.question.question;
      this.temps = this.question.temps;
      this.title1 = this.choices[0].title;
      this.title2 = this.choices[1].title;
    }
  },

  methods: {
    handleSubmit: function (e) {
      e.preventDefault();

      this.img1 = document.getElementById("image1").files[0];
      this.img2 = document.getElementById("image2").files[0];

      // on remplit les img par les img existantes
      if (!this.img2) this.img2 = { name: this.choices[1].img };
      if (!this.img1) this.img1 = { name: this.choices[0].img };

      const body = {
        label: this.label,
        question: this.textQuestion,
        temps: this.temps,
        title1: this.title1,
        img1: this.img1.name,
        title2: this.title2,
        img2: this.img2.name,
      };

      if (this.type == "add") this.uploadQuestion(body);
      else if (this.type == "update") this.uploadUpdateQuestion(body);
    },

    uploadQuestion: async function (body) {
      const questions = await addQuestion(this.$axios, body);
      this.uploadImages(questions);
      this.$router.push("./");
    },

    uploadUpdateQuestion: async function (body) {
      body.id1 = this.choices[0].id;
      body.id2 = this.choices[1].id;

      body.img1 = this.renameFile(
        this.question.id,
        this.choices[0].id,
        body.img1
      );
      body.img2 = this.renameFile(
        this.question.id,
        this.choices[1].id,
        body.img2
      );

      const form = this.createForm(this.question);

      await updateQuestion(this.$axios, this.question.id, body);
      await updateUploadImage(this.$axios, form); // upload nouvelle image (écrase l'ancienne)
      this.$router.push(".");
    },

    uploadImages: async function (questions) {
      // récupère la dernière question
      let lastQuestion =
        questions[Object.keys(questions)[Object.keys(questions).length - 1]];

      lastQuestion.choices[0].img = this.renameFile(
        lastQuestion.id,
        lastQuestion.choices[0].id,
        lastQuestion.choices[0].img
      );

      lastQuestion.choices[1].img = this.renameFile(
        lastQuestion.id,
        lastQuestion.choices[1].id,
        lastQuestion.choices[1].img
      );

      const bodyChanged = {
        img1: lastQuestion.choices[0].img,
        img2: lastQuestion.choices[1].img,
        id1: lastQuestion.choices[0].id,
        id2: lastQuestion.choices[1].id,
        temps: this.temps,
      };

      // update la question avec les bonnes valeurs d'images
      await updateQuestion(this.$axios, lastQuestion.id, bodyChanged);
      const form = this.createForm(lastQuestion);

      await updateUploadImage(this.$axios, form);
    },

    renameFile: function (idQuestion, idChoice, string) {
      let ext = string.split(".");
      return "q" + idQuestion + "_c" + idChoice + "." + ext[1];
    },

    createForm: function (question) {
      const form = new FormData();
      form.append("img1", this.img1);
      form.append("img2", this.img2);
      form.append("idQuestion", question.id);
      form.append("idChoice1", question.choices[0].id);
      form.append("idChoice2", question.choices[1].id);
      return form;
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

<style scoped>
/*=========== bouton form temps ========== */

.tooltipWrapper {
  position: relative;
  display: inline-block;
}

.tooltipTime {
  visibility: hidden;
  background-color: rgba(61, 77, 124, 0.92);
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
  padding: 4px;
  border-radius: 6px;
  position: absolute;
  margin-bottom: 4px;
  bottom: 100%;
  left: 0;
  width: 120px;
  z-index: 1;
  transform: translateX(-5px);
}

.inputTime {
  width: 100%;
  transform: translate(-5px);
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
}

.inputTime:hover + .tooltipTime {
  visibility: visible;
}
</style>