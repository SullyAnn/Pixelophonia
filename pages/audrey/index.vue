<template>
<main id="adminIndex">
  <h1>Bienvenue sur l'interface administrateur</h1>
  <div id="menu">
    <NuxtLink to="./launchGame" class ="btnMenu">Lancer une partie</NuxtLink>
    <NuxtLink to="./creation/" class="btnMenu">Création des questions</NuxtLink>
  </div>
</main>
</template>

<script>
import "@/assets/css/admin.css";

export default {
  layout: 'IndexAdmin'
}
</script>
