<template>
  <div>
    <AdminHeader />

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

    <ButtonReturn linkBack="./" />
  </div>
</template>

<script>
import { getConcerts } from "@/assets/classes/Admin.js";

export default {
  head: {
    title: "Lancer le concert",
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
