<template>
    <section id="homePageContent">
        <p v-if="affichage ==0"> Bienvenue sur l'application Pixélophonia, 
            <br>L'ochestre ne propose aucun jeu pour le moment.
        </p>
        <p v-else-if ="affichage==1"> Bienvenue sur l'application Pixélophonia, 
           <br> Attendez les instructions du chef d'ochestre pour pouvoir voter </p>
        <p v-else-if ="affichage==2"> Merci pour votre participation! </p>
            
    </section>


</template>

<script>
import "@/assets/css/playerHomePages.css";

// valeurAffichage prend 0, 1 ou 2 -> modifie le message de l'écran d'accueil en fonction des actions de l'admin
let valeurAffichage = 2;

export default {
    name: "homePages",
    layout : "homePage",
    data: function setDisplayStatus(){
        return {
            affichage : valeurAffichage
        }
    },
}

// Condition du v-if == 0 : avaleur par défaut pas de partie en cours. 
// Condition du v--else-if == 1 : partie lancée par admin au clic sur lancer partie. 
// Condition du v-else-if == 2 : partie terminée par admin au clic sur croix.

</script>