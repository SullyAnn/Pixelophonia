<template>
  <NuxtLink :to="linkBack" class="creationGoBackContainer" v-bind:disabled="{ disabled: isInGame }" >
    <div class="goBack">
      <button class="btn back">
        <svg
          class="svg-icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M810.666667 554.666667H213.333333c-25.6 0-42.666667-17.066667-42.666666-42.666667s17.066667-42.666667 42.666666-42.666667h597.333334c25.6 0 42.666667 17.066667 42.666666 42.666667s-17.066667 42.666667-42.666666 42.666667z"
          />
          <path
            d="M512 853.333333c-12.8 0-21.333333-4.266667-29.866667-12.8l-298.666666-298.666666c-17.066667-17.066667-17.066667-42.666667 0-59.733334l298.666666-298.666666c17.066667-17.066667 42.666667-17.066667 59.733334 0s17.066667 42.666667 0 59.733333L273.066667 512l268.8 268.8c17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 8.533333-17.066667 12.8-29.866667 12.8z"
          />
        </svg>
      </button>
      {{ text }}
    </div>
  </NuxtLink>
</template>
<script>
export default {
  props: {
    isInGame: {
      type: Boolean, 
      default: false
    },
    text: {
      type: String,
      default: "Retour",
    },
    linkBack: {
      type: String, 
      default: ""
    }
  },
};
</script>
<style scoped>
.goBack {
  float: left;
}
.btn.back {
  background: #fff;
  color: #3d4d7c;
}

.btn.back:hover,
.btn.back:focus {
  background: #9ca3b9;
  color: #fff;
}
</style>