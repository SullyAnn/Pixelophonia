<template>
  <div id="resultSection">
    <div class="resultMessage">
      <p v-if="!isChoiceSubmitted">
        Nous nous dirigeons vers notre prochaine destination.
      </p>

      <p v-else-if="isPlayerChoiceWinner">
        Bien joué voyageur ! Nous nous dirigeons vers la direction que vous avez
        choisie.
      </p>

      <p v-else>Pas de chance ! nous empruntons l'autre chemin.</p>

      <p class="destination">{{ destination }}</p>
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
    destination: String,
  },
};
</script>

<style scoped>
#resultSection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resultMessage {
  z-index: 20;
  position: absolute;
  width: 85%;
}

p {
  font-family: "Montserrat";
  font-weight: 300;
  font-size: 20px;
  color: rgba(64, 70, 89, 1);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 25px;
  border-radius: 25px;
  text-align: center;
}

.destination {
  background-color: #404659;
  color: #fff;
  margin: 10px;
  padding: 10px;
}

img {
    height: 100%;
    width: 100vw;
    object-fit: cover;
}



@media screen and (min-width: 768px) {
  #resultSection {
    width: 100%;
  }
  .resultMessage {
    width: 50vw;
  }
}

@media screen and (min-width: 1024px) {
  .resultMessage {
    width: 30vw;
  }
}
</style>