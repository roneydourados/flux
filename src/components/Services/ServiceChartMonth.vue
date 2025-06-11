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
import moment from "moment";

const { amountFormated } = useUtils();
const serviceStore = useServiceStore();

const { calculeServiceTotals } = useServiceUtils();

const $servicesInvoice = computed(() => {
  // Objeto para acumular os valores por dia
  interface AccumulatedService {
    serviceDate: string;
    total: number;
  }

  const accumulatedServices: { [key: string]: AccumulatedService } = {};

  serviceStore.$services?.returnServices?.forEach((service) => {
    // Formatar a data para YYYY-MM-DD usando moment
    const serviceDay = moment(service.serviceDate).format("D");

    // Calcular o total do serviço
    const total = Number(calculeServiceTotals(service).valorNumber.toFixed(2));

    // Se já existe um serviço nesse dia, acumula o valor
    if (accumulatedServices[serviceDay]) {
      accumulatedServices[serviceDay].total += total;
    } else {
      // Caso contrário, cria uma nova entrada
      accumulatedServices[serviceDay] = {
        serviceDate: serviceDay,
        total: total,
      };
    }
  });

  // Converter o objeto de volta para um array
  return Object.values(accumulatedServices);
});

const chartOptions = computed(() => {
  return {
    series: [
      {
        name: "Tarefas",
        data:
          $servicesInvoice.value.map((service) => Number(service.total)) ?? [],
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
        text: "Fluxo diário de serviços",
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
            colors: $servicesInvoice.value.map(() => "#B8B8B8"),
          },
          formatter: function (val: any) {
            return amountFormated(val, true);
          },
        },
      },
      xaxis: {
        categories: $servicesInvoice.value.map(
          (service) => service.serviceDate
        ),
        labels: {
          show: true,
          style: {
            colors: $servicesInvoice.value.map(() => "#B8B8B8"),
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
