<template>
  <div>
    <img :src="icon" />
    <input
      :type="type"
      :name="name"
      :placeholder="placeholder"
      required
    />
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    type: String,
    name: String,
    placeholder: String,
  },
};
</script>

<style scoped>

div {
  margin: 10px;
  border-bottom: solid;
  border-width: thin;
  display: flex;
  align-items: center;
  width: auto;
}
img {
  width: 16px;
  height: fit-content;
}

input {
  background: unset;
  padding: 16px;
  font-size: 16px;
  border: unset;
  margin: 0;
  width: -webkit-fill-available;
}
</style>