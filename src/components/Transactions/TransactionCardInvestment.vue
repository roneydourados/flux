<template>
  <div>
    <Card>
      <div class="d-flex align-center" style="gap: 1rem">
        <TransactionInvestmentSVG height="30" />
        <span> Investimento </span>
      </div>

      <v-row dense>
        <v-col cols="12">
          <h2 style="font-weight: 400">
            {{ amountFormated($totals, true) }}
          </h2>
        </v-col>
      </v-row>
    </Card>
  </div>
</template>

<script setup lang="ts">
const transactions = useTransactionStore();
const { amountFormated } = useUtils();
const $totals = computed(() => {
  return transactions.$all.reduce((acc, transaction) => {
    if (transaction.type === "INVESTMENT") {
      acc += Number(transaction.amount!);
    }

    return acc;
  }, 0);
});
</script>
