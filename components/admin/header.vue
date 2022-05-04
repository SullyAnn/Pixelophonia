<template>
  <div class="adminHeader">
    <div class="administrateur">
      <img src="/Logo-carre-BD.png">
      <p>Administrateur</p>
    </div>
    <button @click="logout" class="btnLogOut btnMenu"> Log out </button>
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
  flex-direction: column;
  height: 10vh;
  align-items: flex-start;
  justify-content: space-between;
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
.administrateur{
  display: flex; 
  align-items: center;
}
.adminHeader .btnLogOut{
  /*margin-left:80vw;*/
   width: 5vw;
  padding: 10px ;
}
.adminHeader .btnMenu{
  border: none;
  margin: 0;
  align-self: center;
  background-color: #3D4D7C;
  color: white;
  align-self: flex-start;
}
.adminHeader .btnMenu:hover{
  color: #3D4D7C;
}
.linkBtnMenu .btnMenu{
  font-size: 24px;
  border-color: white;
}

</style>
