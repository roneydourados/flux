<template>
  <div>
    <Card>
      <div class="d-flex align-center" style="gap: 1rem">
        <TransactionDownSVG height="30" />
        <span> Despesas </span>
      </div>

      <v-row dense>
        <v-col cols="12">
          <h2 style="font-weight: 400">
            {{ amountFormated($total ?? 0, true) }}
          </h2>
        </v-col>
      </v-row>
    </Card>
  </div>
</template>

<script setup lang="ts">
const dashboard = useDashboardStore();

const { amountFormated } = useUtils();

const $total = computed(() => dashboard.$dashboard?.totalExpense);
</script>
