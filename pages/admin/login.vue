<template>
  <section class="section">
    <div class="login">
      <div class="columns">
        <div class="adminImage">
          <img src="../../assets/images/Logo-carre-BD.png">
          <h2>Administrateur</h2>
        </div>
        <div class="column is-4 is-offset-4">
        <Notification :message="error" v-if="error"/>
            <form method="post" @submit.prevent="login">
                <div>
                  <img src="../../assets/images/mail.png" class="icon">
                  <input v-model="email" type="text" name="email" class="labelChoicelogin" required>
                </div>
                <div id="passwordInput">
                  <img src="../../assets/images/password.png" class="icon">
                  <input v-model="password" type="password" name="password" class="labelChoicelogin" required>
                </div>
                <button type="submit" class="btnMenu btnLogIn">Log In</button>
            </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import "@/assets/css/admin.css";
import Notification from '~/components/Notification'
export default {
  components: {
    Notification,
  },
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
        this.error = err.response.data.message
      }
    }
  }
}
</script>
<style>
.btnLogIn{
  width: 5vw;
  padding: 10px !important;
}
.login form .btnMenu{
  border: none;
  margin: 0;
  align-self: center;
  margin-top: 25px;
  background-color: #3D4D7C;
  color: white;
}
.login form .btnMenu:hover{
  color: #3D4D7C;
  background-color : white;
}

.login{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.section{
  height:100vh;
}
.login .columns{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 50vh;
    padding: 40px;
    border-radius: 40px;
    background: rgba(255,255,255,0.5);
  
}
.labelChoicelogin{
  background: unset;
  padding: 16px;
  font-size: 16px;
  border: unset;
  margin: 0;
  width: -webkit-fill-available;
}
.login form{
  background-color: unset;
}
.login form div{
    margin: 0;
    border-bottom: solid;
    border-width: thin;
    display: flex;
    align-items: center;
    width: auto;
}
.icon{
  width: 16px;
  height: fit-content;
}

.adminImage{
  border-radius: 50px;
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.adminImage img{
  width: 100%;
  border-radius: 150px;
}
.adminImage h2{
  font-weight: 300;
  font-size: 16px;
}
.column{
  width: 40vh;
}

</style>