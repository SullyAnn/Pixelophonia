<template>
  <div class="spinnerWrapper">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.spinnerWrapper {
  width: 96px;
  height: 96px;
  display: flex; 
  align-items: center;
  justify-content: center;
}
.spinner,
.spinner:after {
  border-radius: 50%;
  width: calc(100% - 32px);
  height: calc(100% - 32px);
}
.spinner {
  position: relative;
  border-top: 12px solid #d2d2d2;
  border-right: 12px solid #d2d2d2;
  border-bottom: 12px solid #d2d2d2;
  border-left: 12px solid #0cb4ce;
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}

@-webkit-keyframes load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes load8 {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

</style>