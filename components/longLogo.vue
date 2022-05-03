<template>
        <div id="logoLong">
            <img id="imageLogoLong" src="@/assets/images/logoLong.png">
        </div>
</template>

<script>
export default {
    
}
</script>

<style>
    @media screen and (max-width: 768px) {
        #logoLong{
            height: auto;
            display: flex;
            justify-content: center;
        }
        #imageLogoLong{
            width: 100px;
        }
    }

</style>