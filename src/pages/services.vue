<template>
  <Services />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import moment from "moment";

const serviceStore = useServiceStore();
const { getFiltersStoreServices, saveServiceFilters } = useUtils();
const loading = ref(false);

onMounted(async () => {
  let filters;
  loading.value = true;
  try {
    const filtersStore = getFiltersStoreServices();

    if (filtersStore) {
      filters = filtersStore;

      await serviceStore.index({
        ClientProject: filters.ClientProject,
        Client: filters.Client,
        initialDate: moment().startOf("month").format("YYYY-MM-DD"),
        finalDate: moment().endOf("month").format("YYYY-MM-DD"),
        invoiced: filters.invoiced,
      });
    } else {
      filters = {
        ClientProject: undefined,
        Client: undefined,
        initialDate: moment().startOf("month").format("YYYY-MM-DD"),
        finalDate: moment().endOf("month").format("YYYY-MM-DD"),
        invoiced: "Todas",
      };

      await serviceStore.index(filters);
    }
    saveServiceFilters(filters);
  } finally {
    loading.value = false;
  }
});
</script>
