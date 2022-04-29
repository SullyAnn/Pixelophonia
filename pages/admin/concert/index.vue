<template>
  <div>
    <AdminHeader />
    <div id="concertContainer">
      <h1>Gestion des concerts</h1>

      <ul class="listElements">
        <li v-for="(concert, index) in concerts" :key="index">
          <NuxtLink :to="`./${concert.id}`">
            <p>{{ concert.title }}</p>
          </NuxtLink>

          <div>
            <ButtonEdit :linkToEdit="`${concert.id}/update`" />
            <ButtonDelete typeToDelete="concert" :idToDelete="concert.id" />
          </div>
        </li>
      </ul>
    </div>

    <ButtonAdd /> 
    <ButtonReturn linkBack="../" />

  </div>
</template>

<script>
import {
  getConcerts,
} from "@/assets/classes/Admin.js";
import "@/assets/css/admin.css";

export default {
  name: "Concerts",

  async asyncData({ $axios }) {
    try {
      const concerts = await getConcerts($axios);

      return {concerts};
    } catch (error) {
      console.log(error);
    }
  },
};
</script>