<template>
  <NuxtLink :to="linkToEdit">
    <button class="btn update">
      <svg
        class="svg-icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M846.8 255L744.5 152.8c-33.1-33.1-87.9-33.1-122.5 0L149.6 625.3c-10.1 10.1-15.8 24.5-15.8 38.9L128 814v4.3c1.4 15.8 7.2 30.2 18.8 40.3 10.1 10.1 24.5 14.4 38.9 14.4h2.9l146.9-5.8c14.4 0 27.3-7.2 37.4-17.3l472.5-472.4c36-34.6 36-89.3 1.4-122.5z m-675 574.3l4.4-124.3 118.3 118.3-122.7 6z m181.1-34.5L204.7 646.7 597 254.4l148.2 148.2-392.3 392.2z m465.8-465.5l-31.5 31.4-148.4-148.2 31.6-31.4c6-6 13.5-9 21-9s15 3 21 9l106.3 106.3c11.9 11.9 11.9 29.9 0 41.9zM907.9 819.8H457.4c-16.6 0-30 13.4-30 30s13.4 30 30 30h450.5c16.6 0 30-13.4 30-30s-13.4-30-30-30zM497.9 769.6c0 16.6 13.4 30 30 30h380c16.6 0 30-13.4 30-30s-13.4-30-30-30h-380c-16.5 0-30 13.4-30 30z"
        />
      </svg>
    </button>
    {{text}}
  </NuxtLink>
</template>

<script>
import "@/assets/css/admin.css";

export default {
  props: {
    linkToEdit: String,
    text: String,
  },
};
</script>

<style scoped>
.update {
  background: #4495B8;
}

.update:hover,
.update:focus {
  background: #186180;
}
</style>