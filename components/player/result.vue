<template>
  <div id="resultSection">
    <div class="resultMessage">
      <p class="resultText" v-if="!isChoiceSubmitted">test</p>

      <p class="resultText" v-else-if="isPlayerChoiceWinner">
        Bien joué voyageur ! Nous nous dirigeons vers la direction souhaitée.
      </p>

      <p class="resultText" v-else>
        Pas de chance ! nous empruntons l'autre chemin.
      </p>
    </div>

    <img
      :src="require(`assets/images/Question_${idQuestion}/` + img)"
      alt="image du choix gagnant"
    />
  </div>
</template>

<script>
export default {
  props: {
    isChoiceSubmitted: Boolean,
    isPlayerChoiceWinner: Boolean,
    idQuestion: Number,
    img: String,
  },
};
</script>