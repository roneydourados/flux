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
      <v-col cols="12" lg="7">
        <ClientSelectSearch
          v-model="filter.client"
          @update:model-value="handleChangeClient"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <SelectInput
          v-model="filter.status"
          label="Situação"
          :items="serviceStatusItens"
          item-title="name"
          item-value="type"
          density="comfortable"
          variant="outlined"
          @update:model-value="handleChangeStatus"
        />
      </v-col>
      <v-col cols="12" lg="3" class="d-flex align-center justify-end">
        <Button
          color="green"
          :block="mobile"
          @click="showForm = true"
          rounded="lg"
        >
          <strong class="mr-1" style="font-size: 0.8rem">+</strong>
          Adicionar serviço
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
        <ServiceChartStatus />
      </v-col>
      <!-- <v-col cols="12" lg="2">
        <ServiceChartProject />
      </v-col> -->
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
});

const serviceStatusItens = [
  { name: "Todas", type: "Todas" },
  { name: "Faturado", type: "Faturadas" },
  { name: "Não Faturado", type: "Não Faturadas" },
];

const $services = computed(() => serviceStore.$all);

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

const getMonth = async (month: number) => {
  filter.value.month = month;

  await getServices();
};

const getYear = async (year: number) => {
  filter.value.year = year;

  await getServices();
};

const handleChangeClient = async () => {
  if (filter.value.client?.id) {
    await getServices();
  }
};

const handleChangeStatus = async () => {
  await getServices();
};

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

  const report = serviceReport($services.value, payloadFilters);

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

const getServices = async () => {
  loading.value = true;

  try {
    const initialDate = moment(
      `${filter.value.year}-${filter.value.month + 1}-01`
    ).format("YYYY-MM-DD");

    const finalDate = moment(initialDate).endOf("month").format("YYYY-MM-DD");

    const payloadFilters = {
      initialDate,
      finalDate,
      Client: filter.value.client,
      invoiced: filter.value.status,
    };

    // salvar os filtros no localstorage
    saveServiceFilters(payloadFilters);

    await serviceStore.index(payloadFilters);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
