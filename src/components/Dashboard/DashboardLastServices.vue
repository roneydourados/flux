<template>
  <div>
    <Card height="425">
      <Table
        title="Ultimos serviços"
        :headers="headers"
        :items="items"
        :items-per-page="11"
        :show-select="false"
        :show-crud="false"
        :loading="false"
        :show-pagination="false"
      >
        <template #title-button>
          <Button
            size="small"
            variant="outlined"
            color="lightgrey"
            @click="$emit('services')"
          >
            Ver mais
          </Button>
        </template>
        <template v-slot:item.transactionType="{ item }">
          <div class="d-flex flex-column" style="gap: 0.5rem">
            <div class="d-flex flex-column mt-2">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center" style="gap: 0.5rem">
                  <v-sheet
                    rounded="lg"
                    height="30"
                    width="30"
                    class="d-flex align-center justify-center"
                  >
                    <v-icon :icon="item.icon" />
                  </v-sheet>
                  <span>{{ item.transactionType }}</span>
                </div>
                <span
                  :style="{ color: item.type === 'D' ? '#E57373' : '#66BB6A' }"
                >
                  {{ item.type === "D" ? "-" : "+" }}
                  {{ amountFormated(item.value, true) }}
                </span>
              </div>
            </div>
            <span
              style="
                font-size: 0.7rem;
                font-weight: 100;
                color: rgb(var(--v-theme-grey)) !important;
              "
            >
              {{ moment(item.date).format("DD MMM, YYYY") }}
            </span>
          </div>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
const { amountFormated } = useUtils();

defineEmits(["services"]);

const headers = ref([
  { title: "", key: "transactionType" },
  // { title: "Valor", key: "value" },
]);

const items = ref([
  {
    transactionType: "Implementação tela dashboard",
    value: 6700,
    date: "2024-10-10",
    type: "C",
    icon: "mdi-dots-hexagon",
  },
  {
    transactionType: "Correção de bug task 88954",
    value: 150,
    date: "2024-11-11",
    type: "C",
    icon: "mdi-credit-card-outline",
  },
  {
    transactionType: "Criar componente no projeto da inpart",
    value: 200,
    date: "2024-11-12",
    type: "C",
    icon: "mdi-dots-hexagon",
  },
  {
    transactionType: "Ajuste de tela de login",
    value: 500,
    date: "2024-11-13",
    type: "C",
    icon: "mdi-dots-hexagon",
  },
]);
</script>
