<template>
  <div>
    <Card>
      <div class="d-flex align-center justify-space-between px-4 mt-n12">
        <span>Serviços</span>

        <div
          class="d-flex flex-wrap align-center justify-end w-100"
          style="gap: 1rem"
        >
          <div class="d-flex align-center text-grey">
            <v-icon icon="mdi-calendar-multiselect" start size="20" />
            <span class="font-weight-bold">
              Duração total: {{ $serviceTotals.totalDuration }}
            </span>
          </div>

          <div class="d-flex align-center">
            <v-icon icon="mdi-cash-clock" start size="20" color="grey" />
            <span class="font-weight-bold text-grey">
              Valor total: {{ $serviceTotals.valorTotal }}
            </span>
          </div>
        </div>
      </div>

      <Table
        title=""
        :headers="headers"
        :items="$allServices"
        :items-per-page="10"
        :show-select="false"
        :show-crud="false"
        :loading="false"
        :show-pagination="true"
      >
        <template v-if="mobile" v-slot:item.mobile="{ item }">
          <v-list density="compact" rounded="lg">
            <v-list-item density="compact">
              <template #title>
                <span style="width: 0.5rem">
                  {{ item.title }}
                </span>
              </template>
              <template #subtitle>
                <div class="d-flex flex-column" style="gap: 0.5rem">
                  {{ amountFormated(item.totalValue, true) }}
                  <div class="d-flex align-center">
                    <v-icon
                      :icon="getStatusIcon(item.status).icon"
                      :color="getStatusIcon(item.status).color"
                      start
                    />
                    <span>
                      {{ getStatusToolTip(item.status) }}
                    </span>
                  </div>
                </div>
              </template>

              <template #append>
                <div class="d-flex align-center" style="gap: 0.5rem">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="showForm = true"
                  >
                    <EditSVG />
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="dialogQuestion = true"
                  >
                    <DeleteSVG />
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </template>
        <template v-slot:item.title="{ item }">
          <ServiceTableItemExpantionPanel :item="item" />
        </template>
      </Table>
      <template #content> </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { amountFormated } = useUtils();
const { calculeServiceTotals } = useServiceUtils();
const serviceStore = useServiceStore();

const showForm = ref(false);
const dialogQuestion = ref(false);
const selectedItem = ref<TransactionProps>();

const $allServices = computed(() => serviceStore.$all);

const $serviceTotals = computed(() => {
  let totalValor = 0;
  let totalDuration = 0;

  serviceStore.$all.map((service) => {
    const totals = calculeServiceTotals(service);
    totalValor += totals.valorNumber;
    totalDuration += totals.finalDuration.asSeconds();
  });

  const duracaoTotal = `${String(Math.floor(totalDuration / 3600)).padStart(
    2,
    "0"
  )}:${String(Math.floor((totalDuration % 3600) / 60)).padStart(
    2,
    "0"
  )}:${String(Math.floor(totalDuration) % 60).padStart(2, "0")}`;

  return {
    valorTotal: amountFormated(totalValor, false),
    totalDuration: duracaoTotal,
  };
});

const headers = computed(() => {
  if (mobile.value) {
    return [{ title: "", key: "mobile" }];
  }
  return [{ title: "", key: "title" }];
});

const getStatusIcon = (status: string) => {
  if (status === "A") return { icon: "mdi-circle-outline", color: "grey" };
  else if (status === "F")
    return { icon: "mdi-check-circle-outline", color: "green" };
  else if (status === "C")
    return { icon: "mdi-alert-circle-outline", color: "red" };
  return { icon: "mdi-circle", color: "grey" };
};

const getStatusToolTip = (status: string) => {
  if (status === "A") return "Aberto";
  else if (status === "F") return "Faturado";
  else if (status === "C") return "Cancelado";
  return "Pendente";
};

const getEditItem = (item: TransactionProps) => {
  showForm.value = true;
  selectedItem.value = item;
};

const itemsMenu = (service: ServiceProps) => {
  if (service.status !== "FINISHED") {
    return [
      {
        title: "Editar",
        icon: "mdi-pencil-outline",
        iconColor: "blue-grey-lighten-1",
      },
      {
        title: "Finalizar tarefa",
        icon: "mdi-text-box-check-outline",
        iconColor: "blue-grey",
      },
      {
        title: "Excluir",
        icon: "mdi-delete-outline",
        iconColor: "blue-grey",
      },
    ];
  } else if (service.status === "FINISHED" && !service.isInvoiced) {
    return [
      {
        title: "Reabrir tarefa",
        icon: "mdi-file-document-refresh-outline",
        iconColor: "blue-grey",
      },
      {
        title: "Faturar",
        icon: "mdi-alert-circle-outline",
        iconColor: "blue-grey",
      },
      {
        title: "Excluir",
        icon: "mdi-delete-outline",
        iconColor: "blue-grey",
      },
    ];
  } else if (service.status === "FINISHED" && service.isInvoiced) {
    return [
      {
        title: "Estornar faturamento",
        icon: "mdi-alert-circle-outline",
        iconColor: "blue-grey",
      },
      {
        title: "Excluir",
        icon: "mdi-delete-outline",
        iconColor: "blue-grey",
      },
    ];
  }

  return [
    {
      title: "Editar",
      icon: "mdi-pencil-outline",
      iconColor: "blue-grey-lighten-1",
    },
    {
      title: "Reabrir tarefa",
      icon: "mdi-file-document-refresh-outline",
      iconColor: "blue-grey",
    },
    {
      title: "Excluir",
      icon: "mdi-delete-outline",
      iconColor: "blue-grey",
    },
  ];
};
</script>
