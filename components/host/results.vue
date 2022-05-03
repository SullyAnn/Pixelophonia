<template>
  <div id="result">
    <img
      v-if="data.winnerChoice"
      :src="
        require(`assets/images/Question_${idQuestion}/` + data.winnerChoice.img)
      "
      alt="image winner"
      class="images"
    />
    <div class="infosResult">
      <h2 v-if="data.isEgalite">Égalité ! La machine a décidé pour vous.</h2>
      <h2 v-else>{{ data.percentage }} % d’entre vous ont choisi cette voie.</h2>
      <h1>{{ data.winnerChoice.title }}</h1>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    idQuestion: Number,
    data: Object,
  },
};
</script>