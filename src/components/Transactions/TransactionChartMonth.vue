<template>
  <div>
    <Chart
      :chart-options="chartOptions.options"
      :series="chartOptions.series"
      :type="chartOptions.options.chart.type"
      :height="chartOptions.options.chart.height"
    />
  </div>
</template>

<script setup lang="ts">
const { amountFormated } = useUtils();
const transactionStore = useTransactionStore();

const chartOptions = computed(() => {
  return {
    series: [
      {
        name: "Receita",
        data: transactionStore.$transactionMonthChart.map((chart) => {
          return Number(chart.credit ?? 0) * 1;
        }),
      },
      {
        name: "Despesas",
        data: transactionStore.$transactionMonthChart.map((chart) => {
          return Number(chart.expense) * 1;
        }),
      },
      {
        name: "Investimentos",
        data: transactionStore.$transactionMonthChart.map((chart) => {
          return Number(chart.investment) * 1;
        }),
      },
    ],

    options: {
      chart: {
        height: "300",
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#55B02E", "#e93030", "#fff"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Fluxo financeiro",
        align: "left",
        style: {
          color: "#fff",
          fontSize: "14px",
          fontWeight: "100",
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      legend: {
        show: true,
        labels: {
          colors: "#B8B8B8",
          useSeriesColors: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: transactionStore.$transactionMonthChart.map(
              () => "#B8B8B8"
            ),
          },
          formatter: function (val: any) {
            return amountFormated(val, true);
          },
        },
      },
      xaxis: {
        categories: transactionStore.$transactionMonthChart.map(
          (chart) => chart.month
        ),
        labels: {
          show: true,
          style: {
            colors: transactionStore.$transactionMonthChart.map(
              () => "#B8B8B8"
            ),
          },
        },
      },
      tooltip: {
        show: false,
        theme: "dark",
        style: {
          fontSize: "16px",
        },
      },
    },
  };
});
</script>
