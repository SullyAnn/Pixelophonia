<template>
  <label class="checkLabel switch">
    <p>{{text}}</p>
    <input
      type="checkbox"
      :name="switchName"
      :class="switchName"
      v-model="checked"
    />
    <span class="slider"></span>
  </label>
</template>

<script>
export default {
  props: {
    switchName: String,
    text: String,
    idQuestion: Number,
    selected: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      checked: false,
    };
  },
  mounted() {
    if (this.selected != 0) this.checked = true;
  },
  updated() {
    this.$root.$emit(this.switchName + "-state", this.idQuestion, this.checked);
  },
};
</script>

<style scoped>
.checkLabel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.3s ease-in-out;
  min-width: 230px;
  height: 30px;
}

.switch {
  position: relative;
}

/* Hide default HTML checkbox */

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */

  input[type="checkbox"i] {
   width: 16px;
   min-width: 16px;
   height: 16px;
 }

.slider {
  background-color: #adadad;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 40px;
  height: 16px;
  border-radius: 40px;
  cursor: pointer;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fff;
  -webkit-transition: 0.2s;
  transition: 0.2s ease;
  border-radius: 50%;
  box-shadow: -1px 1px 4px #adadad;
}

/* slider checké (bleu clair) */
input:checked + .slider {
  background-color: #0cb4ce;
  width: 40px;
}

input:focus + .slider {
  box-shadow: 0 0 1px #00697e;
}

/* rond bleu foncé */
input:checked + .slider:before {
  -webkit-transform: translateX(30px);
  -ms-transform: translateX(30px);
  transform: translate(16px, -50%);
  background-color: #00697e;
  box-shadow: 1px 1px 4px #adadad;
}

p {
  max-width: 80%;
}
</style>