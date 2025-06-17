<template>
  <Services />
  <!-- <DialogLoading :dialog="loading" /> -->
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const serviceStore = useServiceStore();
const { getFiltersStoreServices } = useUtils();
//const loading = ref(false);

onMounted(async () => {
  let filter = {
    ClientProject: undefined,
    Client: undefined as ClientProps | undefined,
    initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    invoiced: "Todas",
    month: dayjs().month(),
    year: dayjs().year(),
    status: "Todas",
  };

  let filtersStore = getFiltersStoreServices();

  if (filtersStore) {
    filter.month = filtersStore.month ?? dayjs().month();
    filter.year = filtersStore.year ?? dayjs().year();
    filter.status = filtersStore.status ?? "Todas";
    filter.invoiced = filtersStore.invoiced;
    filter.Client = filtersStore.Client;
    filter.initialDate = filtersStore.initialDate;
    filter.finalDate = filtersStore.finalDate;
  }

  await serviceStore.index(filter);
});
</script>
