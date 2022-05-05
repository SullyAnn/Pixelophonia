<template>
  <NuxtLink
    :to="linkBack"
    class="creationGoBackContainer"
    v-bind:disabled="{ disabled: isInGame }"
  >
    <div class="goBack">
      <div class="bgButton"></div>
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
        <p>{{ text }}</p>
    </div>
  </NuxtLink>
</template>
<script>
export default {
  props: {
    isInGame: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "Retour",
    },
    linkBack: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped>

.goBack {
  cursor: pointer;
  width: fit-content;
  text-align: center;
  transition: all 0.3s;
  overflow: hidden;
  position: relative;
  border-radius: 11px;
  display: flex;
  align-items: center;
  width: 170px;
}

.bgButton {
  position: absolute;
  left: 15%;
  top: 50%;
  height: 1px;
  width: 1px;
  transform: translate(-15%, -50%);
  border-radius: 50%;
  transition: 1.2s;
  background: #3d4d7c;
  z-index: 0;

}
.goBack:hover .bgButton {
  transform: scale(300);
}


.goBack:hover p {
  z-index: 1;
  color: #fff;
}
p {
  position: relative;
  transition: 0.3s;
  margin-left: 15px;
}
.btn.back {
  background: #3d4d7c;
    position: relative;
    margin:0;
}

.btn.back:hover,
.btn.back:focus {
  color: #fff;
}
</style>