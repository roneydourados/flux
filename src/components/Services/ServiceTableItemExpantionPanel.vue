<template>
  <div>
    <v-expansion-panels>
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
              {{ item._count?.serviceOccurrence ?? 0 }}

              <span>Vlr Hora</span>
              {{ amountFormated(item.hourValue ?? 0, true) }}

              <span>Total</span>
              {{ amountFormated(item.totalValue ?? 0, true) }}
            </div>

            <div class="d-flex align-center mr-6">
              <div class="d-flex align-center" style="gap: 0.5rem">
                <v-icon
                  :icon="getStatusIcon(item.status!).icon"
                  :color="getStatusIcon(item.status!).color"
                />
                {{ getStatusToolTip(item.status!) }}
              </div>

              <div class="d-flex align-center ml-4" style="gap: 0.5rem">
                <ServiceAnimedTimerSVG
                  height="20"
                  v-if="item.status === 'STARTED'"
                />
                <v-btn
                  icon
                  color="blue-grey-lighten-2"
                  variant="text"
                  type="submit"
                  size="small"
                  :disabled="item.status === 'FINISHED'"
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
                    :disabled="
                      item.status === 'STARTED' || item.status === 'FINISHED'
                    "
                  >
                    <DeleteSVG />
                    Apagar
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
      @confirm="dialogQuestion = false"
    />
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { useDisplay } from "vuetify";

defineProps({
  item: {
    type: Object as PropType<ServiceProps>,
    required: true,
  },
});
const { amountFormated } = useUtils();
const { mobile } = useDisplay();
const { calculeServiceTotalsOccurence } = useServiceUtils();

const showForm = ref(false);
const dialogQuestion = ref(false);
const selectedItem = ref<ServiceProps>();

const $totalHours = (item: ServiceOccurrenceProps, hourValue: number) => {
  return calculeServiceTotalsOccurence(
    moment(item.started).format("YYYY-MM-DD HH:mm:ss"),
    item.ended ? moment(item.ended).format("YYYY-MM-DD HH:mm:ss") : undefined,
    hourValue
  );
};

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

const getEditItem = (item: ServiceProps) => {
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
</script>
