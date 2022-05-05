<template>
  <main>
    <div class="launchContainer">
      <h1>Choisissez le concert à lancer !</h1>
      
      <ListContainer
      type="concert"
      :displayButtons="false"
      :datas="concerts"
      preLink="launcher/"
      />
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
