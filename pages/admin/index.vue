<template>
<main>
	<AdminHeader />
	<h1>Bienvenue sur l'interface administrateur</h1>

	<div id="menu">
		<!-- TO DO : changer newAdmin dans les path -->
		<NuxtLink to="/admin/launch" class="linkBtnMenu"> 
			<button class ="btnMenu"> Lancer la partie </button>
		</NuxtLink>
		
		<NuxtLink to="/admin/creation" class="linkBtnMenu">
			<button class ="btnMenu"> Créer votre jeu </button>
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

	mounted () { 
		// ce bloc est appelé plusieurs les pages : en faire un fonction globale ?
		if (performance.navigation.type == performance.navigation.TYPE_RELOAD) 
		{
			this.reload = true;
			console.info( "This page is reloaded" );
			socket.emit("reload-all-pages", this.isReload)
		} 
		else {
			console.info( "This page is not reloaded");
		}
	},
	methods: {

	}
}
</script>
