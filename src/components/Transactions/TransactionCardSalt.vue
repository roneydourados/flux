<template>
  <div>
    <Card>
      <div class="d-flex align-center" style="gap: 1rem">
        <WalletSVG height="18" />
        <span> Saldo </span>
      </div>

      <v-row dense>
        <v-col cols="12">
          <h2 style="font-weight: 400">{{ amountFormated($salt, true) }}</h2>
        </v-col>
      </v-row>
    </Card>
  </div>
</template>

<script setup lang="ts">
const transactions = useTransactionStore();
const { amountFormated } = useUtils();
const $salt = computed(() => {
  const totals = transactions.$all.reduce(
    ({ credit, debit, investment }, transaction) => {
      if (transaction.type === "INVESTMENT") {
        investment += Number(transaction.amount!);
      } else if (transaction.type === "CREDIT") {
        credit += Number(transaction.amount!);
      } else if (transaction.type === "EXPENSE") {
        debit += Number(transaction.amount!);
      }

      return {
        credit,
        debit,
        investment,
      };
    },
    { credit: 0, debit: 0, investment: 0 }
  );

  return totals.credit + totals.investment - totals.debit;
});
</script>
