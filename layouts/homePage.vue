<template>
    <div id="layoutContainer">
        <logoLongPlayer />
        <Nuxt />
    </div>
</template>

<style>
#layoutContainer{
    height: 100vh;
}
</style>

<script>
import logoLongPlayer from "@/components/logoLongPlayer.vue"

export default {
    components : {
        logoLongPlayer
    }   
}
</script>