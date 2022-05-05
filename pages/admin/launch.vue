<template>
  <main>
    <div class="launchContainer">
      <h1>Choisissez le concert à lancer !</h1>
      <ul class="listElements">
        <li v-for="(concert, index) in concerts" :key="index">
          <NuxtLink :to="`launcher/${concert.id}`">
            <p>{{ concert.title }}</p>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <ButtonContainer :isReturn="true" linkBack="./" />
  </main>
</template>

<script>
import { getConcerts } from "@/assets/classes/Admin.js";

export default {
  layout: "admin",

  head: {
    title: "Admin | Lancer le concert",
  },

  async asyncData({ $axios }) {
    try {
      const concerts = await getConcerts($axios);
      return { concerts };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>

</style>
