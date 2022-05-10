<template>
  <main>
    <div id="addQuestion" class="window">
      <h2>Ajouter une question</h2>

      <FormQuestion type="add" />
      <NuxtLink to="./">Revenir à la liste (sans sauvegarder)</NuxtLink>
    </div>
  </main>
</template>

<script>
import "@/assets/css/admin.css";

export default {
  layout: "admin",
};
</script>