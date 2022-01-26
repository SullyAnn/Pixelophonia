<template>
<main>
	<AdminHeader />
	<div>
		<!--<button @click="logout" class ="btnLogOut"> Log out </button>-->
	</div>
	<h1>Bienvenue sur l'interface administrateur</h1>

	<div id="menu">
		<!-- TO DO : changer newAdmin dans les path -->
		<NuxtLink to="/admin/launchConcert" class="linkBtnMenu"> 
			<button class ="btnMenu"> Lancer un concert </button>
		</NuxtLink>
		
		<NuxtLink to="/admin/creation" class="linkBtnMenu">
			<button class ="btnMenu"> Gérer les questions </button>
		</NuxtLink>	
		<NuxtLink to="/admin/concert/" class="linkBtnMenu">
			<button class ="btnMenu"> Gérer les concerts </button>
		</NuxtLink>	
	</div>

</main>
</template>

<script>
import "@/assets/css/admin.css";
import socket from '~/plugins/socket.io.js'

export default {
	head: {
		title: 'Admin'
	},
	middleware: ['auth'],
	mounted () { 
	},
	methods: {
		lauchMenu: function(){
			socket.emit("menu", 1)
		},
		async logout() {
			await this.$auth.logout();  // this method will logout the user and make token to false on the local storage of the user browser
		}
	}
}
</script>
