<template>
  <div>
    <AdminHeader /> 
    <Nuxt id="main" />
    <AdminFooter id="footer" />
  </div>
</template>

<style scoped>
div {
  height: 100%;
  display: flex;
  flex-direction: column;
}
#main {
  flex: 1;
}
#footer {
  align-items: flex-end;
}

</style>