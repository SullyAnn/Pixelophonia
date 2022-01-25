<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
            <form method="post" @submit.prevent="login">
                <input v-model="email" type="text" name="email" class="labelChoice" required>
                <input v-model="password" type="password" name="password" class="labelChoice" required>

                  <button type="submit" class="btnMenu btnLogIn">Log In</button>
            </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import Notification from '~/components/Notification'
import "@/assets/css/admin.css";
export default {
//   components: {
//     Notification,
//   },

  data(){
    return {
      email: 'testemail',
      password: 'testpassword',
      error: null
    }
  },
  mounted() {
        if (this.$auth.loggedIn) {
          this.$router.push('/admin/')
        }
  },
  methods: {
    async login() {
      try {
        let response = await this.$auth.loginWith('local', {
          data: {
          email: this.email,
          password: this.password
          }
        })
        console.log("ok admin authentifié")
        this.$router.push('/admin/')
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style>
.btnLogIn{
  width:20vw;
  padding:10px !important;
}
</style>