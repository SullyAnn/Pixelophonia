<template>
  <section id="homePageContainer">
    <div id="homePageContent">
      <LongLogo />

      <p class="homePageText" v-if="affichage == 0">
        Bienvenue sur l'application Pixelophonia ! <br />L'ochestre ne propose
        aucun jeu pour le moment.
      </p>
      <p class="homePageText" v-else-if="affichage == 1">
        Bienvenue sur l'application Pixelophonia ! <br />
        Attendez les instructions du chef d'ochestre pour pouvoir voter.
      </p>
      <p class="homePageText" v-else-if="affichage == 2">
        Merci pour votre participation !
      </p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    affichage: Number,
  },
};
</script>

<style scoped>
#homePageContainer {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

p {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  padding: 20px;
  text-align: center;
  font-size: 18px;
  margin: 15px 30px;
}
@media screen and (max-width: 768px) {
}
</style>