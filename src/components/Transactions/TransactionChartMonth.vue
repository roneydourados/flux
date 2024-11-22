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
const chartOptions = computed(() => {
  return {
    series: [
      {
        name: "Receita",
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
      },
      {
        name: "Despesas",
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
      },
    ],

    options: {
      chart: {
        height: "250",
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#55B02E", "#e93030"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Fluxo do mês Novembro",
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
            colors: Array(30).fill("#B8B8B8"),
          },
          formatter: function (val: any) {
            return amountFormated(val, true);
          },
        },
      },
      xaxis: {
        categories: Array.from({ length: 30 }, (_, i) => i + 1),
        labels: {
          show: true,
          style: {
            colors: Array(30).fill("#B8B8B8"),
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
