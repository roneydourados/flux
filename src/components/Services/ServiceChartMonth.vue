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
const serviceStore = useServiceStore();

const chartOptions = computed(() => {
  return {
    series: [
      {
        name: "Tarefas",
        data:
          serviceStore.$services?.servicesInvoice.map(
            (service) => service.total
          ) ?? [],
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
      colors: ["#FB8C00"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Fluxo de serviços do mês",
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
            colors: serviceStore.$services?.servicesInvoice.map(
              () => "#B8B8B8"
            ),
          },
          formatter: function (val: any) {
            return amountFormated(val, true);
          },
        },
      },
      xaxis: {
        categories: serviceStore.$services?.servicesInvoice.map(
          (service) => service.dayMonth
        ),
        labels: {
          show: true,
          style: {
            colors: serviceStore.$services?.servicesInvoice.map(
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
