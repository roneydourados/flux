<template>
  <div>
    <Card>
      <Table
        title="Ultimas transações"
        :headers="headers"
        :items="$transactions"
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
            @click="$router.push('/finance')"
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
                    height="35"
                    width="35"
                    class="d-flex align-center justify-center"
                  >
                    <v-icon :icon="item.Category.icon" />
                  </v-sheet>
                  <span>{{ item.Category.categoryName }}</span>
                </div>
                <span
                  :style="{
                    color: item.type === 'DEBIT' ? '#E57373' : '#66BB6A',
                  }"
                >
                  {{ item.type === "DEBIT" ? "-" : "+" }}
                  {{ amountFormated(item.amount, true) }}
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
              {{ moment(item.dueDate).format("DD MMM, YYYY") }}
            </span>
          </div>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
const dashboard = useDashboardStore();

const { amountFormated } = useUtils();

const $transactions = computed(() => {
  return dashboard.$dashboard?.lastTransactions;
});

defineEmits(["transactions"]);

const headers = ref([
  { title: "", key: "transactionType" },
  // { title: "Valor", key: "value" },
]);
</script>
