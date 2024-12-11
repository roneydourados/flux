<template>
  <div class="mt-1">
    <v-expansion-panels :readonly="isUpdate">
      <v-expansion-panel>
        <v-expansion-panel-title disable-icon-rotate>
          <div
            class="d-flex align-center justify-space-between text-grey-darken-1 w-100"
            style="gap: 0.5rem"
          >
            <div
              class="d-flex align-center text-grey-darken-1"
              style="gap: 0.5rem"
            >
              <span
                class="d-inline-block text-truncate"
                style="max-width: 20rem"
              >
                <v-icon icon="mdi-file-outline" start />
                {{ item.title }}
              </span>
              <v-icon icon="mdi-clock-outline"> </v-icon>
              <span>Total de ocorrências</span>
              {{ item._count?.ServiceOccurrence ?? 0 }}

              <span>Vlr Hora</span>
              {{ amountFormated(item.hourValue ?? 0, true) }}

              <span>Total</span>
              {{ amountFormated(item.totalValue ?? 0, true) }}
            </div>

            <div class="d-flex align-center mr-6">
              <div class="d-flex align-center" style="gap: 0.5rem">
                <v-icon
                  :icon="getStatus(item).icon"
                  :color="getStatus(item).color"
                />
                {{ getStatus(item).title }}
              </div>

              <div class="d-flex align-center ml-4" style="gap: 0.5rem">
                <div
                  v-if="item.status === 'STARTED'"
                  class="d-flex align-center"
                  style="gap: 0.5rem"
                >
                  <ServiceAnimedTimerSVG height="20" />
                  <span>{{ currentHour }}</span>
                </div>
                <v-btn
                  icon
                  color="blue-grey-lighten-2"
                  variant="text"
                  type="submit"
                  size="small"
                  :disabled="item.status === 'FINISHED'"
                  @click="updateStatusService(item)"
                >
                  <ServiceTimerPlaySVG
                    height="30"
                    v-if="item.status === 'STOPPED'"
                  />
                  <ServiceTimerStopSVG height="20" v-else />
                  <v-tooltip
                    activator="parent"
                    location="top center"
                    content-class="tooltip-background"
                  >
                    {{ item.status === "STOPPED" ? "Iniciar" : "Parar" }}
                  </v-tooltip>
                </v-btn>
                <MenuButton
                  :items="itemsMenu(item)"
                  variant="text"
                  size="small"
                  is-icon
                  @click="handleClickMenuButton($event, item)"
                >
                  <EditSVG />
                </MenuButton>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="dialogQuestion = true"
                >
                  <DeleteSVG />
                </v-btn>
              </div>
            </div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div
            v-for="serviceOccorrence in item.ServiceOccurrence"
            :key="serviceOccorrence.id"
          >
            <v-row dense>
              <v-col cols="12" lg="4">
                <InfoLabel :show-divider="false" color-icon="primary">
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <v-icon icon="mdi-file-chart-outline" color="blue-grey" />
                    <span
                      class="d-inline-block text-truncate text-caption text-blue-grey font-weight-bold"
                      :style="mobile ? 'width: 12rem' : 'width: 30rem'"
                    >
                      {{ item.title }}

                      <v-tooltip
                        activator="parent"
                        location="top center"
                        content-class="tooltip-background"
                      >
                        <v-card width="500" elevation="0" color="transparent">
                          <v-card-text class="text-subtitle-1">
                            {{ item.title }}
                          </v-card-text>
                        </v-card>
                      </v-tooltip>
                    </span>
                  </div>
                </InfoLabel>
              </v-col>
              <v-col cols="12" lg="2">
                <InfoLabel
                  title="Início"
                  font-size="0.9"
                  font-size-content="0.8"
                  :show-divider="false"
                  icon="mdi-calendar-multiselect-outline"
                  color-icon="primary"
                  :content="
                    moment(serviceOccorrence?.started).format(
                      'DD/MM/YYYY HH:mm:ss'
                    )
                  "
                />
              </v-col>
              <v-col cols="12" lg="2">
                <InfoLabel
                  title="Fim"
                  font-size="0.9"
                  font-size-content="0.8"
                  :show-divider="false"
                  icon="mdi-calendar-multiselect-outline"
                  color-icon="primary"
                  :content="
                    serviceOccorrence?.ended
                      ? moment(serviceOccorrence?.ended).format(
                          'DD/MM/YYYY HH:mm:ss'
                        )
                      : 'Trabalhando'
                  "
                />
              </v-col>
              <v-col cols="12" lg="1">
                <InfoLabel
                  class="ml-2"
                  title="Tempo"
                  font-size="0.9"
                  :show-divider="false"
                  icon="mdi-clock-outline"
                  color-icon="orange"
                  font-size-content="0.9"
                  :content="
                    $totalHours(serviceOccorrence, item.hourValue).horas
                  "
                />
              </v-col>
              <v-col cols="12" lg="2">
                <InfoLabel
                  title="Valor"
                  font-size="0.9"
                  :show-divider="false"
                  icon="mdi-cash-clock"
                  color-icon="success"
                  font-size-content="0.9"
                  :content="
                    $totalHours(serviceOccorrence, item.hourValue).valor
                  "
                />
              </v-col>
              <v-col cols="12" lg="1">
                <div
                  class="d-flex align-center justify-end w-100"
                  style="gap: 0.5rem"
                >
                  <v-btn
                    variant="text"
                    class="text-none"
                    size="small"
                    icon
                    :disabled="
                      item.status === 'STARTED' || item.status === 'FINISHED'
                    "
                  >
                    <DeleteSVG />
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <DialogQuestion
      v-model="dialogQuestion"
      title="Apagar Serviço"
      text="Uma vez deletada não poderá recuperá-la!"
      color-confirm="red"
      text-confirm="Deletar"
      @cancel="dialogQuestion = false"
      @confirm="handleDestroy"
    />
    <DialogQuestion
      v-model="showFinish"
      title="Finalizar Serviço"
      text="Confirma a finalização do serviço."
      color-confirm="green"
      text-confirm="Finalizar"
      @cancel="showFinish = false"
      @confirm="handleFinishService"
    />
    <DialogQuestion
      v-model="showReopen"
      title="Reabrir Serviço"
      text="Confirma a reabertura do serviço."
      color-confirm="warning"
      text-confirm="Reabrir"
      @cancel="showReopen = false"
      @confirm="handleReopenService"
    />
    <ServiceForm v-model="showForm" :data="selectedItem" />
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { useDisplay } from "vuetify";

const props = defineProps({
  item: {
    type: Object as PropType<ServiceProps>,
    required: true,
  },
});

const { amountFormated, getFiltersStoreServices } = useUtils();
const { mobile } = useDisplay();
const { calculeServiceTotalsOccurence } = useServiceUtils();
const serviceStore = useServiceStore();

const isUpdate = ref(false);
const loading = ref(false);
const showForm = ref(false);
const dialogQuestion = ref(false);
const interval = ref();
const valueTimer = ref(0);

//const editService = ref(false);
//const showDestroy = ref(false);
const showFinish = ref(false);
const showReopen = ref(false);

const currentHour = ref("");

const selectedItem = ref<ServiceProps>();

const $totalHours = (item: ServiceOccurrenceProps, hourValue: number) => {
  return calculeServiceTotalsOccurence(
    moment(item.started).format("YYYY-MM-DD HH:mm:ss"),
    item.ended ? moment(item.ended).format("YYYY-MM-DD HH:mm:ss") : undefined,
    hourValue
  );
};

onMounted(() => {
  if (props.item.status === "STARTED") {
    timerCount();
  } else if (
    props.item.status === "FINISHED" ||
    props.item.status === "STOPPED"
  ) {
    if (interval.value) {
      clearInterval(interval.value);
    }
  }
});

const getStatus = (service: ServiceProps) => {
  if (service.status === "STARTED") {
    return {
      title: "Trabalhando",
      icon: "",
      color: "",
    };
  }
  if (service.status === "STOPPED") {
    return {
      title: "Em Pausa",
      icon: "mdi-motion-pause-outline",
      color: "info",
    };
  } else if (service.status === "FINISHED" && !service.isInvoiced) {
    return {
      title: "Finalizado",
      icon: "mdi-alert-outline",
      color: "purple",
    };
  } else if (service.status === "FINISHED" && service.isInvoiced) {
    return {
      title: "Faturado",
      icon: "mdi-cash-multiple",
      color: "success",
    };
  } else {
    return {
      title: "Pendente",
      icon: "mdi-alert-circle-outline",
      color: "warning",
    };
  }
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
        title: "Finalizar serviço",
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
        title: "Reabrir serviço",
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
      title: "Reabrir serviço",
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

const updateStatusService = async (service: ServiceProps) => {
  loading.value = true;
  isUpdate.value = true;
  try {
    await serviceStore.update({
      publicId: service.publicId,
      title: service.title,
      clientProjectId: service.clientProjectId,
      hourValue: service.hourValue,
      serviceDate: service.serviceDate,
      status: service.status === "STARTED" ? "STOPPED" : "STARTED",
      updateOccorrence: true,
      occurrenceStartDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
      occurrenceEndDate: moment().format("YYYY-MM-DDTHH:mm:ss"),
    });

    if (service.status === "STARTED" || service.status === "FINISHED") {
      clearInterval(interval.value);
    } else {
      timerCount();
    }

    await loadServices();
  } finally {
    loading.value = false;
    isUpdate.value = false;
  }
};

const timerCount = () => {
  currentHour.value = "calculando...";

  // timer corrente
  valueTimer.value = 0;

  const ocStart = moment(
    props.item.lastOpenOccurence ?? moment().format("YYYY-MM-DDTHH:mm:ss")
  ); // substitua por sua primeira data

  interval.value = setInterval(() => {
    const final = moment(); // substitua por sua segunda data

    const duration = moment.duration(final.diff(ocStart)).add(1, "second"); // calcula a duração entre as duas datas
    const totalHours = String(Math.floor(duration.asHours())).padStart(2, "0");
    const totalMinutes = String(Math.floor(duration.asMinutes()) % 60).padStart(
      2,
      "0"
    );
    const totalSeconds = String(Math.floor(duration.asSeconds()) % 60).padStart(
      2,
      "0"
    );

    currentHour.value = `${totalHours}:${totalMinutes}:${totalSeconds}`;

    if (valueTimer.value === 100) {
      return (valueTimer.value = 0);
    }

    valueTimer.value += 10;
  }, 1000);
};

const loadServices = async () => {
  const filters = getFiltersStoreServices();
  try {
    await serviceStore.index({
      initialDate: filters.initialDate,
      finalDate: filters.finalDate,
      ClientProject: filters.ClientProject,
      Client: filters.Client,
      invoiced: filters.invoiced,
    });
  } catch (error) {
    console.log("🚀 ~ handleDestroy ~ error:", error);
  }
};

const handleEditTask = (service: ServiceProps) => {
  selectedItem.value = service;
  console.log("🚀 ~ handleEditTask ~ selectedItem.value:", selectedItem.value);
  showForm.value = true;
  console.log("🚀 ~ handleEditTask ~ showForm.value:", showForm.value);
};

const handleClickMenuButton = async (title: string, service: ServiceProps) => {
  isUpdate.value = true;
  try {
    if (title === "Editar") {
      if (service.status === "FINISHED") {
        useNuxtApp().$toast.warning(
          "Serviço finalizado, não é possível editar"
        );
        return;
      }
      handleEditTask(service);
    } else if (title === "Excluir") {
      selectedItem.value = service;
      dialogQuestion.value = true;
    } else if (title === "Finalizar serviço") {
      if (service.status === "FINISHED") {
        useNuxtApp().$toast.warning("Serviço já finalizado!");
        return;
      }
      selectedItem.value = service;
      showFinish.value = true;
    } else if (title === "Reabrir serviço") {
      if (service.status === "STARTED") {
        useNuxtApp().$toast.warning("serviço já reiniciado!");
        return;
      }

      if (service.isInvoiced) {
        useNuxtApp().$toast.warning(
          "serviço já faturado não é possível reabrir!"
        );
        return;
      }

      selectedItem.value = service;
      showReopen.value = true;
    } else if (title === "Estornar faturamento") {
      if (!service.isInvoiced) {
        useNuxtApp().$toast.warning("Serviço não faturado!");
        return;
      }

      loading.value = true;
      try {
        await serviceStore.update({
          publicId: service.publicId,
          hourValue: service.hourValue,
          title: service.title,
          clientProjectId: service.clientProjectId,
          serviceEndDate: service.serviceEndDate,
          isInvoiced: false,
        });
        await loadServices();
      } finally {
        loading.value = false;
      }
    } else if (title === "Faturar") {
      if (service.isInvoiced) {
        useNuxtApp().$toast.warning("Serviço já faturado!");
        return;
      }

      loading.value = true;
      try {
        await serviceStore.update({
          publicId: service.publicId,
          hourValue: service.hourValue,
          title: service.title,
          clientProjectId: service.clientProjectId,
          serviceEndDate: service.serviceEndDate,
          isInvoiced: true,
        });
        await loadServices();
      } finally {
        loading.value = false;
      }
    }
  } finally {
    isUpdate.value = false;
  }
};

const handleFinishService = async () => {
  showFinish.value = false;
  if (!selectedItem.value?.publicId) return;

  loading.value = true;
  try {
    await serviceStore.update({
      publicId: selectedItem.value!.publicId,
      title: selectedItem.value!.title,
      clientProjectId: selectedItem.value!.clientProjectId,
      hourValue: selectedItem.value!.hourValue,
      serviceEndDate: moment().format("YYYY-MM-DD"),
      status: "FINISHED",
      updateOccorrence: false,
    });

    await loadServices();

    selectedItem.value = {} as ServiceProps;
  } finally {
    loading.value = false;
  }
};

const handleDestroy = async () => {
  dialogQuestion.value = false;

  if (!selectedItem.value?.publicId) return;

  loading.value = true;
  try {
    try {
      await serviceStore.destroy(selectedItem.value.publicId);
      await loadServices();
      selectedItem.value = {} as ServiceProps;
    } catch (error) {
      console.log("🚀 ~ handleDestroy ~ error:", error);
    }
  } finally {
    loading.value = false;
  }
};

const handleReopenService = async () => {
  showReopen.value = false;
  if (!selectedItem.value?.publicId) return;

  loading.value = true;
  try {
    await serviceStore.update({
      publicId: selectedItem.value!.publicId,
      title: selectedItem.value!.title,
      clientProjectId: selectedItem.value!.clientProjectId,
      hourValue: selectedItem.value!.hourValue,
      status: "STOPPED",
      updateOccorrence: false,
    });

    await loadServices();
    selectedItem.value = {} as ServiceProps;
  } finally {
    loading.value = false;
  }
};
</script>
