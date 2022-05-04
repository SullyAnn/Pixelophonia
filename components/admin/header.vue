<template>
  <section class="adminHeader">
    <div class="administrateur">
      <img src="/Logo-carre-BD.png" />
      <p>Session administrateur</p>
    </div>

    <button @click="logout" class="btnText btnLittle">Log out</button>
  </section>
</template>

<script>
export default {
  methods: {
    async logout() {
      await this.$auth.logout(); // this method will logout the user and make token to false on the local storage of the user browser
    },
  },
};
</script>
<style scoped>

.adminHeader {
  height: 10vh;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
}
.administrateur {
  display: flex;
  align-items: center;
}

img {
  height: 32px;
  border-radius: 100%;
}

p {
  width: auto;
  padding: 12px;
  font-size: 1.2rem;
  text-align: left;
}

</style>
