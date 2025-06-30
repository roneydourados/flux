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
          v-model="filter.Client"
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
        <!-- <Button
          color="green"
          :block="mobile"
          @click="showForm = true"
          rounded="lg"
          class="mt-1"
        >
          <strong class="mr-1" style="font-size: 0.8rem">+</strong>
          Novo serviço
          <v-icon icon="mdi-account-wrench-outline" end />
        </Button> -->
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
          Exportar serviços PDF
        </v-btn>
        <v-btn
          class="text-none"
          variant="flat"
          color="success"
          size="small"
          @click="handleExportServicesToExcel"
        >
          <v-icon icon="mdi-microsoft-excel" start size="22" />
          Exportar serviços excel
        </v-btn>
      </v-col>
      <v-col cols="12" lg="3">
        <ServiceChartProject />
      </v-col>
    </v-row>

    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

import { pdfMakeFonts } from "@/utils/pdfMakeFonts";
import pdfMake from "pdfmake/build/pdfmake";
import { useExportReport } from "~/composables/ExportReport";

defineProps({
  title: {
    type: String,
    default: "",
  },
});

//const { mobile } = useDisplay();
const { saveServiceFilters, getFiltersStoreServices } = useUtils();
const { exportReportPDF, exportReportExcel } = useExportReport();
const { user } = useUserSession();
const serviceStore = useServiceStore();

const loading = ref(false);

const filter = ref({
  month: dayjs().month(),
  year: dayjs().year(),
  status: "Todas",
  invoiced: "Todas",
  Client: undefined as ClientProps | undefined,
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
});

const serviceStatusItens = [
  { name: "Todas", type: "Todas" },
  { name: "Faturado", type: "Faturadas" },
  { name: "Não Faturado", type: "Não Faturadas" },
];

const $services = computed(() => serviceStore.$services);

onMounted(async () => {
  const filters = getFiltersStoreServices();

  if (filters) {
    filter.value.month = filters.month ?? dayjs().month();
    filter.value.year = filters.year ?? dayjs().year();
    filter.value.status = filters.status ?? "Todas";
    filter.value.invoiced = filters.invoiced;
    filter.value.Client = filters.Client;
    filter.value.initialDate = filters.initialDate;
    filter.value.finalDate = filters.finalDate;
  }

  await getServices();
});

const handleExportServicesToPDF = () => {
  // const initialDate = dayjs(
  //   `01-${filter.value.month <= 9 ? "0" : ""}${filter.value.month + 1}-${
  //     filter.value.year
  //   }`
  // ).format("DD-MM-YYYY");

  // const finalDate = dayjs(initialDate, "DD-MM-YYYY")
  //   .endOf("month")
  //   .format("YYYY-MM-DD");

  const payloadFilters = {
    initialDate: filter.value.initialDate,
    finalDate: filter.value.finalDate,
    Client: filter.value.Client,
    invoiced: filter.value.status,
  } as ServiceFilterProps;

  const report = exportReportPDF(
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

const handleExportServicesToExcel = () => {
  // const month = filter.value.month + 1;
  // const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  // const initialDate = `${filter.value.year}-${formattedMonth}-01`;

  // const finalDate = dayjs(initialDate).endOf("month").format("YYYY-MM-DD");

  const payloadFilters = {
    initialDate: filter.value.initialDate,
    finalDate: filter.value.finalDate,
    Client: filter.value.Client,
    invoiced: filter.value.status,
  } as ServiceFilterProps;

  exportReportExcel($services.value?.returnServices ?? [], payloadFilters);
};

const getMonth = async (month: number) => {
  const year = dayjs().year();
  const selectMonth = month < 10 ? `0${month + 1}` : (month + 1).toString();

  filter.value.initialDate = dayjs(`${year}-${selectMonth}`).format(
    "YYYY-MM-DD"
  );

  filter.value.finalDate = dayjs(filter.value.initialDate)
    .endOf("month")
    .format("YYYY-MM-DD");

  await getServices();
};

const getYear = async (year: number) => {
  const selectMonth = dayjs(filter.value.initialDate).format("MM");

  filter.value.initialDate = dayjs(`${year}-${selectMonth}-01`).format(
    "YYYY-MM-DD"
  );
  filter.value.finalDate = dayjs(filter.value.initialDate)
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
      Client: filter.value.Client,
      invoiced: filter.value.status,
    };

    await serviceStore.index(payloadFilters);

    saveServiceFilters(payloadFilters);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
