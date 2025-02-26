<template>
  <ClientInfoData />
</template>

<script setup lang="ts">
const projectStore = useProjectsStore();
const clientStore = useClientStore();

onMounted(() => {
  projectStore.clearAll();
  clientStore.clearAll();
});
</script>
