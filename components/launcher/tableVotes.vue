<template>
  <table class="nbTotalVotes">
    <tr>
      <th colspan="2">Nombre de votes</th>
    </tr>
    <tr>
      <td>{{ title1 }}</td>
      <td>{{ votesData.choice1 }}</td>
    </tr>
    <tr>
      <td>{{ title2 }}</td>
      <td>{{ votesData.choice2 }}</td>
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
        choice1: 0,
        choice2: 0,
      },
    };
  },

  methods: {
    resetVotes: function () {
      this.votesData = { total: 0, choice1: 0, choice2: 0 };
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  /* width: 25%; */
}

table, td {
  border: 1px solid #3d4d7c;
}

th {
  background-color: #3d4d7c;
  color: #fff;
}

th, td {
  padding: 4px 16px;
  font-size: 1rem;
}

table td:nth-child(2),
table th:nth-child(2) {
  text-align: center;
}

.nbTotalVotes {
  width: 100%;
  font-weight: bold;
  font-size: 1.125rem;
}
</style>