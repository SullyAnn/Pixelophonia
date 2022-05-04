<template>
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
          <button type="submit" class="btnText btnLogIn">Se connecter</button>
        </form>
      </section>
    </div>
  </section>
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
#loginPage {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 50vh;
  padding: 40px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 5px 5px 5px rgba(180, 180, 1880, 0.5);
}

#infos {
  width: 40vh;
}

form {
  background-color: unset;
  position: relative;
}


.btnLogIn {
  width: 5vw;
  min-width: 100px;

  padding: 10px;

  align-self: center;

  margin: 25px;

  background-color: #3d4d7c;
  color: white;
  border: 1px solid #3d4d7c;
}

.btnLogIn:hover {
  color: #3d4d7c;
  background-color: white;

}
</style>