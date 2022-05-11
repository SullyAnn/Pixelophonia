<template>
  <main>
    <section id="loginPage">

    <div class="card">

      <AdminLoginHeader />
      <section id="infos">
        <AdminNotification :message="error" v-if="error" />
        <form method="post" @submit.prevent="login">
          <FormLogin
            type="text"
            name="email"
            icon="/mail.png"
            placeholder="adresse mail"
            v-model="email"
          />

          <FormLogin
            type="password"
            name="password"
            icon="/password.png"
            placeholder="mot de passe"
            v-model="password"
          />
          <button type="submit" class="btnText btnLittle btnLogIn">Se connecter</button>
        </form>
      </section>
    </div>

    </section>
    <ButtonContainer :isReturn="true" linkBack="../.." class="buttonReturn" />
  </main>
</template>

<script>
export default {
  data() {
    return {
      email: "testemail",
      password: "testpassword",
      error: null,
    };
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.$router.push("/admin/");
    }
  },
  methods: {
    async login() {
      try {
        let response = await this.$auth.loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
          },
        });
        this.$router.push("/admin/");
        console.log(response);
      } catch (err) {
        console.log(err);
        this.error = err.response.data.message;
      }
    },
  },
};
</script>
<style scoped>

main {
  width: 100vw;
  height: 100vh;
}
#loginPage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90vh;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 50vh;
  max-height: 500px;
  padding: 40px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 5px 5px 5px rgba(180, 180, 1880, 0.5);
}

#infos {
  width: 40vw;
  max-width: 500px;
}

form {
  background-color: unset;
  position: relative;
}

.btnLogIn {
  align-self: center;
  margin: 25px;
}

.buttonReturn {
  height: 10vh;
}

@media screen and (max-width: 768px) {
  .card {
    width: 80vw;
    height: 70vh;
    padding: 20px;
  }
}

</style>