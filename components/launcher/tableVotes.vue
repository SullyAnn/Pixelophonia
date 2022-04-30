<template>
  <table class="nbTotalVotes">
    <tr>
      <th colspan="2">Nombre de votes</th>
    </tr>
    <tr>
      <td>{{ title1 }}</td>
      <td>{{ votesData.votesChoice1 }}</td>
    </tr>
    <tr>
      <td>{{ title2 }}</td>
      <td>{{ votesData.votesChoice2 }}</td>
    </tr>
    <tr>
      <th>Total</th>
      <th>{{ votesData.total }}</th>
    </tr>
  </table>
</template>

<script>
import socket from "~/plugins/socket.io.js";

export default {
  props: {
    title1: String,
    title2: String,
  },

  beforeMount() {
    socket.on("augmentation-nb-votes", (votesInfos) => {
      this.votesData = votesInfos;
    });
  },

  data() {
    return {
      votesData: {
        total: 0,
        votesChoice1: 0,
        votesChoice2: 0,
      },
    };
  },

  methods: {
    resetVotes: function () {
      this.votesData = { total: 0, votesChoice1: 0, votesChoice2: 0 };
    },
  },
};
</script>

<style scoped>
</style>