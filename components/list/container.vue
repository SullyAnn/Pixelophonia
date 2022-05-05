<template>
  <ul>
    <ListElement
      v-for="(data, i) in datas"
      :key="i"
      :type="type"
      :title="data[titleFlag]"
      :description="data[descFlag]"
      :id="data.id"
      :link="preLink + data.id"
      :displayButtons="displayButtons"
    />
  </ul>
</template>

<script>
export default {
  props: {
    datas: Array,
    type: String,
    preLink: String,
    displayButtons: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      titleFlag: "",
      descFlag: "",
    };
  },
  mounted() {
    this.setFlags();
    switch (this.type) {
      case "question":
        this.titleFlag = "label";
        this.descFlag = "question";
        break;
      case "concert":
        this.titleFlag = "title";
        break;
      default:
        break;
    }
  },
  methods: {
    setFlags: function () {},
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  width: 80vw;
}
</style>