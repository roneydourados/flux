<template>
  <Services />
  <!-- <DialogLoading :dialog="loading" /> -->
</template>

<script setup lang="ts">
import moment from "moment";

const serviceStore = useServiceStore();
const { getFiltersStoreServices } = useUtils();
//const loading = ref(false);

onMounted(async () => {
  let filter = {
    ClientProject: undefined,
    Client: undefined as ClientProps | undefined,
    initialDate: moment().startOf("month").format("YYYY-MM-DD"),
    finalDate: moment().endOf("month").format("YYYY-MM-DD"),
    invoiced: "Todas",
    month: moment().month(),
    year: moment().year(),
    status: "Todas",
  };

  let filtersStore = getFiltersStoreServices();

  if (filtersStore) {
    filter.month = filtersStore.month ?? moment().month();
    filter.year = filtersStore.year ?? moment().year();
    filter.status = filtersStore.status ?? "Todas";
    filter.invoiced = filtersStore.invoiced;
    filter.Client = filtersStore.Client;
    filter.initialDate = filtersStore.initialDate;
    filter.finalDate = filtersStore.finalDate;
  }

  await serviceStore.index(filter);
});
</script>
