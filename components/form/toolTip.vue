<template>
  <div class="tooltip"> {{ msg }} </div>
</template>

<script>
export default {
  props: {
    msg: String,
  },
};
</script>

<style scoped>
.tooltip {
  background-color: rgb(61, 77, 124);
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
  padding: 4px;
   border-radius: 6px;
  position: absolute;
  transition: 0.2s ease-in-out;
  bottom: 100%;
  right: 15%;
  width: 150px;
  z-index: 2;
}
</style>