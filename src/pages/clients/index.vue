<template>
  <Client />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const clientStore = useClientStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await clientStore.index();
  } finally {
    loading.value = false;
  }
});
</script>
