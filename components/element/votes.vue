<template>
  <h2 v-if="totalVotes <= 1" class="nbTotalVotes">{{ totalVotes }} vote</h2>
  <h2 v-else class="nbTotalVotes">{{ totalVotes }} votes</h2>
</template>

<script>
export default {
  props: {
    totalVotes: Number,
  },
};
</script>