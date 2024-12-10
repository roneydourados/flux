<template>
  <Services />
</template>

<script setup lang="ts">
import moment from "moment";

const serviceStore = useServiceStore();

await useAsyncData(
  async () =>
    await serviceStore.index({
      ClientProject: undefined,
      Client: undefined,
      initialDate: moment().startOf("month").format("YYYY-MM-DD"),
      finalDate: moment().endOf("month").format("YYYY-MM-DD"),
      invoiced: "Todas",
    })
);
</script>
