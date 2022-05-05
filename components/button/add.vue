<template>
    <NuxtLink :to="link">
      <button class="btn add">
        <svg
          class="svg-icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M914.049331 467.620233 554.92923 467.620233 554.92923 108.498086c0-24.334221-19.72525-44.028772-44.031842-44.028772-24.303522 0-44.031842 19.694551-44.031842 44.028772l0 359.122147L107.743398 467.620233c-24.303522 0-44.030819 19.72832-44.030819 44.031842 0 24.337291 19.727297 44.033889 44.030819 44.033889l359.122147 0 0 359.119077c0 24.335245 19.72832 44.031842 44.031842 44.031842 24.306592 0 44.031842-19.696598 44.031842-44.031842l0-359.119077 359.120101 0c24.305569 0 44.031842-19.696598 44.031842-44.033889C958.082196 487.348554 938.354899 467.620233 914.049331 467.620233z"
          />
        </svg>
      </button>
    </NuxtLink>

</template>
<script>
import "@/assets/css/admin.css";

export default {
  props: {
    link: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
.add {
  background: #6cad56;
}

.add:hover,
.add:focus {
  background: #4c8a38;
}

/* .add{
  display: flex;
  justify-content: flex-start;
} */
</style>