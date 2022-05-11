<template>
  <section id="header">
    <img src="/Logo-carre-BD.png" />
    <h2>Administrateur</h2>
  </section>
</template>

<style scoped>
#header {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

img {
  height: 100%;
  max-height: 150px;
  border-radius: 150px;
}

h2 {
  font-weight: 400;
  font-size: 18px;
}


@media screen and (max-height: 768px) {
  #header {
    
  }
  img {
    height: 50%;
    width: auto;
  }
}

</style>