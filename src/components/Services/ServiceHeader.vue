<template>
  <div class="py-4">
    <v-row dense>
      <v-col cols="12" lg="9" class="d-flex flex-column">
        <Months
          class="w-100"
          @month="getMonth($event)"
          @year="getYear($event)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4">
        <ClientSelectSearch
          v-model="filter.client"
          @update:model-value="getServices"
        />
      </v-col>
      <v-col cols="12" lg="8" class="d-flex flex-wrap" style="gap: 0.5rem">
        <DatePicker label="Data inicial" v-model="filter.initialDate" />
        <DatePicker label="Data final" v-model="filter.finalDate" />

        <SelectInput
          v-model="filter.status"
          label="Situação"
          :items="serviceStatusItens"
          item-title="name"
          item-value="type"
          density="comfortable"
          variant="outlined"
          @update:model-value="getServices"
        />

        <v-btn
          icon
          flat
          color="primary"
          size="small"
          @click="getServices"
          class="mt-1"
        >
          <v-icon>mdi-reload</v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Atualiazar
          </v-tooltip>
        </v-btn>
        <Button
          color="green"
          :block="mobile"
          @click="showForm = true"
          rounded="lg"
          class="mt-1"
        >
          <strong class="mr-1" style="font-size: 0.8rem">+</strong>
          Novo serviço
          <v-icon icon="mdi-account-wrench-outline" end />
        </Button>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="6">
        <ServiceChartMonth />
      </v-col>
      <v-col cols="12" lg="3" class="d-flex flex-column" style="gap: 0.5rem">
        <ServiceTotalCard />
        <v-btn
          class="text-none"
          variant="flat"
          color="deep-purple"
          size="small"
          @click="handleExportServicesToPDF"
        >
          <ServicePDFExportSVG class="mr-2" />
          Exportar serviços
        </v-btn>
      </v-col>
      <v-col cols="12" lg="3">
        <ServiceChartProject />
      </v-col>
    </v-row>
    <ServiceForm v-model="showForm" />
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { useDisplay } from "vuetify";

import { pdfMakeFonts } from "@/utils/pdfMakeFonts";
import pdfMake from "pdfmake/build/pdfmake";

defineProps({
  title: {
    type: String,
    default: "",
  },
});

const { mobile } = useDisplay();
const { saveServiceFilters, getFiltersStoreServices } = useUtils();
const { serviceReport } = useExportPDF();
const { user } = useUserSession();
const serviceStore = useServiceStore();
const showForm = ref(false);
const loading = ref(false);

const filter = ref({
  month: moment().month(),
  year: moment().year(),
  status: "Todas",
  client: undefined as ClientProps | undefined,
  initialDate: moment().startOf("month").format("YYYY-MM-DD"),
  finalDate: moment().endOf("month").format("YYYY-MM-DD"),
});

const serviceStatusItens = [
  { name: "Todas", type: "Todas" },
  { name: "Faturado", type: "Faturadas" },
  { name: "Não Faturado", type: "Não Faturadas" },
];

const $services = computed(() => serviceStore.$services);

onMounted(() => {
  const filtersStore = getFiltersStoreServices();

  if (filtersStore) {
    filter.value.client = filtersStore.Client;
    filter.value.month = filtersStore.initialDate
      ? moment(filtersStore.initialDate).month()
      : moment().month();
    filter.value.year = filtersStore.initialDate
      ? moment(filtersStore.initialDate).year()
      : moment().year();
    filter.value.status = filtersStore.invoiced;
  }
});

const handleExportServicesToPDF = () => {
  const initialDate = `01-${filter.value.month + 1}-${filter.value.year}`;
  const finalDate = moment(initialDate, "DD-MM-YYYY")
    .endOf("month")
    .format("YYYY-MM-DD");

  const payloadFilters = {
    initialDate,
    finalDate,
    Client: filter.value.client,
    invoiced: filter.value.status,
  } as ServiceFilterProps;

  const report = serviceReport(
    $services.value?.returnServices ?? [],
    payloadFilters
  );

  pdfMake.vfs = pdfMakeFonts.vfs;
  pdfMake
    //@ts-ignore
    .createPdf(report)
    .download(
      `Relatorio_${user.value?.name?.replaceAll(" ", "_")}_horas_${
        payloadFilters.initialDate
      }_${payloadFilters.finalDate}`
    );
};

const getMonth = async (month: number) => {
  const year = moment().year();
  const selectMonth = month < 10 ? `0${month + 1}` : (month + 1).toString();

  filter.value.initialDate = moment(`${year}-${selectMonth}`).format(
    "YYYY-MM-DD"
  );

  filter.value.finalDate = moment(filter.value.initialDate)
    .endOf("month")
    .format("YYYY-MM-DD");

  await getServices();
};

const getYear = async (year: number) => {
  const selectMonth = moment(filter.value.initialDate).format("MM");

  filter.value.initialDate = moment(`${year}-${selectMonth}-01`).format(
    "YYYY-MM-DD"
  );
  filter.value.finalDate = moment(filter.value.initialDate)
    .endOf("month")
    .format("YYYY-MM-DD");

  await getServices();
};

const getServices = async () => {
  loading.value = true;

  try {
    const payloadFilters = {
      initialDate: filter.value.initialDate,
      finalDate: filter.value.finalDate,
      Client: filter.value.client,
      invoiced: filter.value.status,
    };

    await serviceStore.index(payloadFilters);

    // salvar os filtros no localstorage
    saveServiceFilters(payloadFilters);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
