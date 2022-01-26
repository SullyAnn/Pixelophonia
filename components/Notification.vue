<template>
  <div class="notification is-danger">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: ['message']
}
</script>
<style>
.is-danger{
  padding: 20px;
  background-color: #f44336;
  color: white;
}
</style>