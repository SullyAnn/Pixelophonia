<template>
  <label class="checkLabel switch">
    {{ text }}
    <input
      type="checkbox"
      :name="switchName"
      :class="switchName"
      v-model="checked"
    /><span class="slider round"></span>
  </label>
</template>

<script>

export default {
  props: {
    switchName: String,
    text: String,
    idQuestion: Number,
    selected:{
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      checked: false,
    };
  },
  mounted() {
    if (this.selected != 0) this.checked = true
  },
  updated() {
    console.log(this.switchName+"-state", this.checked)
    this.$root.$emit(this.switchName+"-state", this.idQuestion, this.checked);
  },
};
</script>

<style scoped>
</style>