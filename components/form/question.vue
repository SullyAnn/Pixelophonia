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
        >Laisser vide ou mettre zéro pour une question sans durée
      </span>
    </div>

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
  uploadImage,
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
    // when form is sent
    handleSubmit: async function (e) {
      e.preventDefault();

      let body = {
        label: this.label,
        question: this.textQuestion,
        temps: this.temps,
        title1: this.title1,
        title2: this.title2,
      };

      this.img1 = document.getElementById("image1").files[0];
      this.img2 = document.getElementById("image2").files[0];

      if (this.type == "add") {
        if (!this.img1 || !this.img2) {
          alert("Il manque une image ! Veuillez l'ajouter.");
        } else {
          // éviter les doublons de nom
          body.img1 = this.img1.name;
          body.img2 = this.renameFileIfDouble(body.img1, this.img2.name);

          this.uploadQuestion(body);
        }
      } else if (this.type == "update") {
        this.uploadUpdateQuestion(body);
      }
    },

    uploadQuestion: async function (body) {
      // add question (& images data) to db
      const questions = await addQuestion(this.$axios, body);

      // upload images on server
      this.uploadImages(questions);

      // back to list
      this.$router.push("./");
    },

    setUpdateFile: function (image, indexChoice) {
      let name = null;
      if (image) {
        name = this.renameFile(
          this.question.id,
          this.choices[indexChoice].id,
          image.name
        );
      }
      return name;
    },

    uploadUpdateQuestion: async function (body) {
      body.img1 = this.setUpdateFile(this.img1, 0);
      body.img2 = this.setUpdateFile(this.img2, 1);
      body.id1 = this.choices[0].id;
      body.id2 = this.choices[1].id;

      // update images data in db
      await updateQuestion(this.$axios, this.question.id, body);

      // upload new images on server
      // it will erase the old ones
      const form = this.createForm(this.question.id, body.img1, body.img2);
      await uploadImage(this.$axios, form);

      // // back to question
      this.$nextTick(() => {
        this.$router.push(".");
      });
    },

    uploadImages: async function (questions) {
      // get last question
      let lastQuestion =
        questions[Object.keys(questions)[Object.keys(questions).length - 1]];

      let nameImg1 = this.renameFile(
        lastQuestion.id,
        lastQuestion.choices[0].id,
        lastQuestion.choices[0].img
      );

      let nameImg2 = this.renameFile(
        lastQuestion.id,
        lastQuestion.choices[1].id,
        lastQuestion.choices[1].img
      );

      const newBody = {
        img1: nameImg1,
        img2: nameImg2,
        id1: lastQuestion.choices[0].id,
        id2: lastQuestion.choices[1].id,
        temps: this.temps,
      };

      const form = this.createForm(lastQuestion.id, nameImg1, nameImg2);

      await updateQuestion(this.$axios, lastQuestion.id, newBody);

      // update question in db with good images datas
      // we need the id of the last question sent to upload it correctly
      // & minimize conflicts
      await uploadImage(this.$axios, form);
    },

    // create formData for upload image
    createForm: function (idQuestion, nameImg1, nameImg2) {
      const form = new FormData();

      form.append("idQuestion", idQuestion);
      if (this.img1) form.append("img1", this.img1, nameImg1);
      if (this.img2) form.append("img2", this.img2, nameImg2);

      return form;
    },

    // ================= fonctions utiles ================= //

    renameFileIfDouble: function (name1, name2) {
      if (name1 == name2) {
        let troncate = name2.split(".");
        name2 = troncate[0] + "_1." + troncate[1];
      }
      return name2;
    },

    // rename image file
    renameFile: function (idQuestion, idChoice, string) {
      console.log(string);
      let ext = string.split(".");
      return "q" + idQuestion + "_c" + idChoice + "." + ext[1];
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