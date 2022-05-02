<template>
  <div>
    <AdminHeader />
    <div class="window">
      <h2>Modifier : {{ question.label }}</h2>

      <FormQuestion type="update" :question="question"/>

      <NuxtLink to="../">Revenir à la liste (sans sauvegarder)</NuxtLink>
    </div>
  </div>
</template>

<script>
import {
  getQuestion,
} from "@/assets/classes/Admin.js";
import "@/assets/css/admin.css";

export default {
  async asyncData({ params, $axios }) {
    const question = await getQuestion($axios, params.id);
    return { question };
  },

};
</script>