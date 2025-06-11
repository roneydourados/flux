<template>
  <div>
    <Card>
      <div class="d-flex align-center" style="gap: 1rem">
        <ServiceSVG height="20" />
        <span> Serviços </span>
      </div>

      <v-row dense>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <CurrencyIconSVG height="25" />
            <h2 style="font-weight: 400">
              {{ $serviceTotals.valorTotal }}
            </h2>
          </div>
          <v-divider class="mt-2" />
        </v-col>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <TimerIconSVG height="25" />
            <h2 style="font-weight: 400">
              {{ $serviceTotals.totalDuration }}
            </h2>
          </div>
        </v-col>
      </v-row>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { amountFormated } = useUtils();
const { calculeServiceTotals } = useServiceUtils();
const serviceStore = useServiceStore();

const $serviceTotals = computed(() => {
  let totalValor = 0;
  let totalDuration = 0;

  serviceStore.$services?.returnServices?.map((service) => {
    const totals = calculeServiceTotals(service);
    totalValor += totals.valorNumber;
    totalDuration += totals.finalDuration.asSeconds();
  });

  const duracaoTotal = `${String(Math.floor(totalDuration / 3600)).padStart(
    2,
    "0"
  )}:${String(Math.floor((totalDuration % 3600) / 60)).padStart(
    2,
    "0"
  )}:${String(Math.floor(totalDuration) % 60).padStart(2, "0")}`;

  return {
    valorTotal: amountFormated(totalValor, false),
    totalDuration: duracaoTotal,
  };
});
</script>
