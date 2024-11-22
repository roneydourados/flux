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
const projects = [
  "Projeto 1",
  "Projeto 2",
  "Projeto 3",
  "Projeto 4",
  "Projeto 5",
];
const chartOptions = computed(() => {
  return {
    series: projects.map((item) => {
      return Math.floor(Math.random() * 100);
    }),
    options: {
      chart: {
        height: "250",
        type: "donut",
      },
      stroke: {
        show: false,
      },
      theme: {
        palette: "palette5",
      },
      title: {
        text: "Serviço por projeto",
        align: "left",
        style: {
          color: "#fff",
          fontSize: "14px",
          fontWeight: "100",
        },
      },
      labels: projects.map((item) => item),
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
          colors: projects.map(() => "#fff"),
        },
        position: "right",
        horizontalAlign: "center",
        floating: false,
        fontSize: "10px",
        fontWeight: 100,
        // formatter(seriesName: any, opts: any) {
        //   return (
        //     seriesName +
        //     " - " +
        //     amountFormated(opts.w.globals.series[opts.seriesIndex] ?? 0, false)
        //   );
        // },
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
