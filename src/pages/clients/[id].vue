<template>
  <ClientInfoData />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const clientStore = useClientStore();
const projectStore = useProjectsStore();

const route = useRoute();
const clientId = route.params.id as string;
const loading = ref(false);

const $single = computed(() => clientStore.$single);

onMounted(async () => {
  loading.value = true;
  try {
    await clientStore.show(clientId);
    await projectStore.index(undefined, $single.value?.id);
  } finally {
    loading.value = false;
  }
});
</script>
