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
        <ClientSelectSearch />
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
      <v-col cols="12" lg="2" class="d-flex flex-column" style="gap: 0.5rem">
        <ServiceTotalCard />
        <v-btn
          class="text-none"
          variant="flat"
          color="deep-purple"
          size="small"
        >
          <ServicePDFExportSVG class="mr-2" />
          Exportar serviços
        </v-btn>
      </v-col>
      <v-col cols="12" lg="2">
        <ServiceChartStatus />
      </v-col>
      <v-col cols="12" lg="2">
        <ServiceChartProject />
      </v-col>
    </v-row>
    <ServiceForm v-model="showForm" />
    <ApplicationOverlay :overlay="loading" />
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { useDisplay } from "vuetify";

defineProps({
  title: {
    type: String,
    default: "",
  },
});

const { mobile } = useDisplay();
const { saveServiceFilters } = useUtils();
const serviceStore = useServiceStore();
const showForm = ref(false);
const loading = ref(false);

const filter = ref({
  month: moment().month(),
  year: moment().year(),
  status: "all",
  client: undefined as ClientProps | undefined,
});

const serviceStatusItens = [
  { name: "Todas", type: "Todas" },
  { name: "Faturado", type: "Faturadas" },
  { name: "Não Faturado", type: "Não Faturadas" },
];

const getMonth = async (month: number) => {
  filter.value.month = month;
  await getServices();
};

const getYear = async (year: number) => {
  filter.value.year = year;
  await getServices();
};

const getServices = async () => {
  try {
    loading.value = true;

    const initialDate = `01-${filter.value.month + 1}-${filter.value.year}`;
    const finalDate = moment(initialDate, "DD-MM-YYYY")
      .endOf("month")
      .format("YYYY-MM-DD");

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
