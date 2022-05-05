<template>
  <main>
    <section id="menu">
      <NuxtLink to="/admin/launch" class="linkBtnMenu">
        <button class="btnMenu">Lancer un concert</button>
      </NuxtLink>

      <NuxtLink to="/admin/question/" class="linkBtnMenu">
        <button class="btnMenu">Gérer les questions</button>
      </NuxtLink>

      <NuxtLink to="/admin/concert/" class="linkBtnMenu">
        <button class="btnMenu">Gérer les concerts</button>
      </NuxtLink>
    </section>
  </main>
</template>

<script>
import "@/assets/css/admin.css";
import socket from "~/plugins/socket.io.js";

export default {
  layout: "admin",
  
  head: {
    title: "Admin | Accueil",
  },
  middleware: ["auth"],
  methods: {
    lauchMenu: function () {
      socket.emit("menu", 1);
    },
    async logout() {
      await this.$auth.logout(); // this method will logout the user and make token to false on the local storage of the user browser
    },
  },
};
</script>

<style scoped>
#menu {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
}

.linkBtnMenu {
  width: 40%;
  text-align: center;
}

.btnMenu {
  display: block;
  width: 100%;
  padding: 30px;
  font-weight: bold;
  border-radius: 11px;
  color: #3d4d7c;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #3d4d7c;
  transition: 0.5s;
}

.btnMenu:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  cursor: pointer;
}
</style>
