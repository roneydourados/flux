<template>
  <div>
    <Card>
      <template #title>
        <div class="d-flex align-center" style="gap: 1rem">
          <ServiceSVG height="20" />
          <span> Serviços </span>
        </div>
      </template>
      <template #content>
        <v-row dense>
          <v-col cols="12">
            <h2 style="font-weight: 400">
              {{ amountFormated($totals, true) }}
            </h2>
          </v-col>
        </v-row>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const transactions = useTransactionStore();
const { amountFormated } = useUtils();
const $totals = computed(() => {
  return transactions.$all.reduce((acc, transaction) => {
    if (transaction.type === "CREDIT") {
      acc += Number(transaction.amount!);
    }

    return acc;
  }, 0);
});
</script>
