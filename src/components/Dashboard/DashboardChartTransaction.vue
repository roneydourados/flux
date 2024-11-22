<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <Card height="565">
          <template #content>
            <Chart
              :chart-options="chartOptions.chartOptions"
              :series="chartOptions.series"
              :height="chartOptions.chartOptions.chart.height"
            />

            <div class="d-flex flex-column mt-6" style="gap: 0.5rem">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center" style="gap: 1rem">
                  <TransactionUpSVG height="30" />
                  <span>Receitas</span>
                </div>
                <span>25%</span>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center" style="gap: 1rem">
                  <TransactionDownSVG height="30" />
                  <span>Despesas</span>
                </div>
                <span>15%</span>
              </div>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center" style="gap: 1rem">
                  <TransactionInvestmentSVG height="30" />
                  <span>Investimentos</span>
                </div>
                <span>5%</span>
              </div>
            </div>
          </template>
        </Card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const chartOptions = computed(() => {
  return {
    series: [25, 15, 5],
    chartOptions: {
      chart: {
        height: "280",
        type: "donut",
      },
      colors: ["#55B02E", "#e93030", "#fff"],
      stroke: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "80%",
          },
        },
      },
      dataLabels: {
        enabled: false,
        // style: {
        //   colors: ["white", "white", "black"],
        // },
        // formatter(val: number /*, opts: any*/) {
        //   return `${val.toFixed(1)} %`;
        // },
      },
      // theme: {
      //   palette: "palette6",
      // },
      // responsive: [
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 200,
      //       },
      //       legend: {
      //         show: false,
      //       },
      //     },
      //   },
      // ],
      //labels: ["Ganhos", "Perdas", "Investimentos"],
      legend: {
        show: false,
        position: "right",
        offsetY: 0,
        height: 230,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
});
</script>
