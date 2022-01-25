<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>

          <!--<Notification :message="error" v-if="error"/>-->

          <form method="post" @submit.prevent="login">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="email"
                  v-model="email"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                />
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">Log In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import Notification from '~/components/Notification'

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