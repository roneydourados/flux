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
            <!-- <TaskOccorrenceForm
                :task="task"
                :task-occorrence="taskOccorrence"
                :task-title="task.title"
                :hideButtons="hideButtons"
                class="mb-2"
              /> -->
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
defineProps({
  item: {
    type: Object as PropType<ServiceProps>,
    required: true,
  },
});
const { amountFormated } = useUtils();

const showForm = ref(false);
const dialogQuestion = ref(false);
const selectedItem = ref<ServiceProps>();

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
