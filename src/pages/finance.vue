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
      status,
    });

    await transactionStore.chartMonth({
      year: Number(moment().year()),
      month: moment(finalDate).month() + 1,
    });
  } finally {
    loading.value = false;
  }
});
</script>
