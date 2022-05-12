<template>
  <fieldset>
    <legend>Choix n°{{ idField }}</legend>

    <div class="tooltipWrapper">
      <input
        v-model="title"
        type="text"
        :name="'image' + idField"
        placeholder="Titre"
        class="labelChoice"
        required
        v-on:change="$emit('update', $event.target.value)"
      />
      <FormToolTip msg="Titre du choix (ex : A la montagne)" />
    </div>

    <div class="tooltipWrapper">
    <input
      v-on:change="previewFile(`display${idField}`, `image${idField}`)"
      type="file"
      accept="image/*"
      :name="'img' + idField"
      :id="'image' + idField"
      style="opacity: 0; width: 0; height: 0"
      
    />
    <label :for="'image' + idField" class="importImg">
      <img :src="imageURL" :id="'display' + idField" />
    </label>
      <FormToolTip msg="Illustration du choix (.png, .jpg ou .gif)" />
    </div>
  </fieldset>
</template>

<script>
export default {
  props: {
    idField: Number,
    choice: Object,
    idQuestion: Number,
  },
  model: {
    prop: "title",
    event: "update",
  },
  data() {
    return {
      title: "",
      imageURL: "/addImage.png",
    };
  },

  beforeMount() {
    if (this.choice && this.choice.img) {
      this.title = this.choice.title;
      this.imageURL =
        "/_nuxt/assets/images/Question_" +
        this.idQuestion +
        "/" +
        this.choice.img;
    }
  },

  methods: {
    previewFile: function (id, idFile) {
      let preview = document.getElementById(id);
      let file = document.getElementById(idFile).files[0];
      let reader = new FileReader();

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
.tooltipWrapper {
  position: relative;
  width: 100%;
}

.tooltipWrapper div {
  visibility: hidden;
  opacity: 0;
}
.tooltipWrapper:hover div {
  visibility: visible;
  opacity: 1;
}
</style>