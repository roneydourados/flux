<template>
  <Transactions />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import moment from "moment";

const transactionStore = useTransactionStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const initialDate = moment().startOf("month").format("YYYY-MM-DD");
    const finalDate = moment().endOf("month").format("YYYY-MM-DD");

    await transactionStore.index({
      initialDate,
      finalDate,
    });

    await transactionStore.chartMonth({
      initialDate,
      finalDate,
    });
  } finally {
    loading.value = false;
  }
});
</script>
