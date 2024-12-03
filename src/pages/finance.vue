<template>
  <Transactions />
</template>

<script setup lang="ts">
const { getTransactions } = useUtils();

useAsyncData(async () => {
  await getTransactions();
});
</script>

<style scoped></style>
