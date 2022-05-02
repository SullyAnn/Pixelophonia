<template>

  <li class="oneQuestion">
    <p class="elementViewConcert">
      <b>{{ question.label }}</b>
      <br />
      <i>{{ question.question }}</i>
    </p>
  </li>
</template>

<script>
export default {
    props: {
        question: Object
    }
}
</script>

<style scoped>
</style>