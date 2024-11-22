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
const chartOptions = computed(() => {
  return {
    series: [30, 20, 18],
    options: {
      chart: {
        height: "250",
        type: "donut",
      },
      stroke: {
        show: false,
      },
      //colors: ["#e93030", "#55B02E"],
      theme: {
        palette: "palette7",
      },
      title: {
        text: "Serviço por status",
        align: "left",
        style: {
          color: "#fff",
          fontSize: "14px",
          fontWeight: "100",
        },
      },
      labels: ["Aberto", "Fechado", "Faturado"],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "10px",
          fontWeight: 100,
        },
        formatter(val: any, opts: any) {
          const name = opts.w.globals.labels[opts.seriesIndex];
          return [name, val.toFixed(1) + "%"];
        },
      },
      legend: {
        show: false,
        labels: {
          colors: ["#fff", "#fff"],
        },
        position: "right",
        horizontalAlign: "center",
        floating: false,
        fontSize: "10px",
        fontWeight: 100,
        onItemClick: {
          toggleDataSeries: true,
        },
        onItemHover: {
          highlightDataSeries: true,
        },
      },
    },
  };
});
</script>
