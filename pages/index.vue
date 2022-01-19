<template>
  <div>
    <ul><li><NuxtLink to="./admin"> Page admin </NuxtLink></li>
    <li><NuxtLink to="./host"> Page host </NuxtLink></li>
    <li><NuxtLink to="./player"> Page player </NuxtLink></li></ul>
  </div>
</template>

<script>
import "@/assets/css/admin.css";

export default {
  name: 'IndexPage',
}
</script>
