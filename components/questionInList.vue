<template>
  <li class="oneQuestion">
    <NuxtLink :to="link">
      <p class="elementViewConcert">
        <b>{{ question.label }}</b>
        <br />
        <i>{{ question.question }}</i>
      </p>
    </NuxtLink>

    <div v-if="link != ''">
      <ButtonEdit :linkToEdit="question.id + `/update`" />
      <ButtonDelete typeToDelete="question" :idToDelete="question.id" />
    </div>
  </li>
</template>

<script>
export default {
  props: {
    question: Object,
    link: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
</style>