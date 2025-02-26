<template>
  <Transactions />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const { getTransactions } = useUtils();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await getTransactions();
  } finally {
    loading.value = false;
  }
});
</script>
