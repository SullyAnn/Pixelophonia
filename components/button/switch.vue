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
    selected: Number
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
    this.$root.$emit(this.switchName+"-state", this.checked);
  },
};
</script>

<style scoped>
</style>