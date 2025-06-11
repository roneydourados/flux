<template>
  <Services />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import moment from "moment";

const serviceStore = useServiceStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const filters = {
      ClientProject: undefined,
      Client: undefined,
      initialDate: moment().startOf("month").format("YYYY-MM-DD"),
      finalDate: moment().endOf("month").format("YYYY-MM-DD"),
      invoiced: "Todas",
    };

    await serviceStore.index(filters);
  } finally {
    loading.value = false;
  }
});
</script>
