<template>
  <div class="adminHeader">
    <img src="../assets/images/Logo-carre-BD.png">
    <p>Administrateur</p>
    <button @click="logout" class ="btnLogOut btnMenu"> Log out </button>
  </div>
</template>
<script>
export default {
	methods: {
		async logout() {
			await this.$auth.logout();  // this method will logout the user and make token to false on the local storage of the user browser
		}
	}
}
</script>
<style>
.adminHeader{
  display: flex;
  align-items: center;
}
.adminHeader img {
height: 32px;
border-radius: 100%;
}
.adminHeader p {
color: #3D4D7C;
font-size: 1rem;
background: none;
padding: 0;
width: auto;
text-align:left;
padding-left: 12px;
}
.btnLogOut{
  margin-left:80vw;
  padding: 10px !important;
}
</style>
