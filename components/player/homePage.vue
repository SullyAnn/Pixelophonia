<template>
    <div id="homePageContent">
      <LongLogo />

      <p class="homePageText" v-if="affichage == 0">
        Bienvenue sur l'application Pixelophonia! <br />L'ochestre ne propose
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

</template>

<script>
export default {
    props: {
        affichage: Number,
    }
}
</script>