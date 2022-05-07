<template>
  <li>
    <NuxtLink :to="link">
      <p>
        <b>{{ title }}</b>
        <br />
        <i>{{ description }}</i>
      </p>
    </NuxtLink>

    <div id="buttons" v-if="displayButtons">
      <ButtonEdit :linkToEdit="id + `/update`" />
      <ButtonDelete :typeToDelete="type" :idToDelete="id" />
    </div>
  </li>
</template>

<script>
export default {
  props: {
    id: Number,
    type: String,
    title: String,
    description: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    displayButtons: {
      type: Boolean,
      default: true,
    },
  },
  mouted() {
    console.log("hello", this.hello)
  }
};
</script>

<style scoped>
li {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
}


p {
  padding: 10px;
  width: 45vw;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 13px;
  text-align: left;
  transition: 0.3s ease-in-out;
  box-shadow: 5px 5px 5px rgba(180, 180, 1880, 0.5);
  margin: 10px;
}

p:hover {
  background: #fff;
  transform: scale(1.05);
}

p:active {
  transform: scale(1.15);
}

#buttons {
  display: flex;
}
</style>