<template>
  <main>
    <div class="launchContainer">
      <h1>Gestion des concerts</h1>
      <ListContainer :datas="concerts" type="concert" preLink="./" />
    </div>

    <ButtonContainer
      :isReturn="true"
      linkBack="../"
      :isAdd="true"
      linkAdd="./add"
    />
  </main>
</template>

<script>
import { getConcerts } from "@/assets/classes/Admin.js";
// import "@/assets/css/admin.css";

export default {
  name: "Concerts",
  layout: "admin",

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