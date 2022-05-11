<template>
  <div id="home">
    <div id="headerHome"><NuxtLink to="/admin">Administrateur</NuxtLink></div>

    <div id="containerHome">
      <div>
        <h1>Bienvenue sur l'application Pixelophonia !</h1>

        <p>
          Prêt à jouer ?
        </p>

        <NuxtLink to="/player"><button>C'est parti !</button></NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
#home {
  display: grid;
  width: 100vw;
  height: 100vh;
}

#headerHome {
  grid-area: 1 / 1 / 1 / 1;
  text-align: right;
  padding: 20px;
}

#containerHome {
  grid-area: 2 / 1 / 20 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#containerHome div {
  text-align: center;
  width: 60vw;
}

h1 {
  width: auto;
}

button:hover {
  cursor: pointer;
  color: #3d4d7c;
  background-color: white;
  transform: scale(1.1);
}

button {
  padding: 10px;
  color: white;
  background-color: #3d4d7c;
  border: 1px solid #3d4d7c;
  transition: 0.3s ease-in-out;
  border-radius: 11px;
  font-weight: bold;
}

button:hover {
}

.btnText {
}
</style>