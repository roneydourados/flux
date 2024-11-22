<template>
  <div>
    <Card>
      <Table
        title=""
        :headers="headers"
        :items="$transactions"
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
                {{ amountFormated(item.amount, true) }}
              </template>

              <template #append>
                <div class="d-flex align-center" style="gap: 0.5rem">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="getEditItem(item)"
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
        <template v-slot:item.amount="{ item }">
          {{ amountFormated(item.amount, true) }}
        </template>
        <!-- <template v-slot:item.emissionDate="{ item }">
          {{ moment(item.emissonDate).format("DD/MM/YYYY") }}
        </template> -->
        <template v-slot:item.dueDate="{ item }">
          {{ moment(item.dueDate).format("DD/MM/YYYY") }}
        </template>
        <template v-slot:item.type="{ item }">
          <v-chip
            :color="returnTypeColor(item.type)"
            class="d-flex align-center px-4"
          >
            <v-icon icon="mdi-circle" size="12" start />
            <span>
              {{ returnTypeName(item.type) }}
            </span>
          </v-chip>
        </template>
        <template v-slot:item.name="{ item }">
          <div class="d-flex flex-column" style="gap: 0.5rem">
            <span>{{ item.name }}</span>
            <div class="d-flex align-center" style="font-size: 0.7rem">
              <v-icon :icon="getPaymentFormName(item.paymentForm).icon" start />
              <span style="color: #e0e0e0">
                {{ getPaymentFormName(item.paymentMethod).name }}
              </span>
            </div>
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <div
            class="d-flex align-center justify-space-between"
            style="gap: 0.5rem"
          >
            <div class="d-flex align-center">
              <v-icon
                :icon="
                  item.status === 'A'
                    ? 'mdi-circle-outline'
                    : 'mdi-check-circle-outline'
                "
                :color="item.status === 'A' ? 'grey' : 'green'"
                start
              />
              <span>{{ item.status === "A" ? "Pendente" : "Pago" }}</span>
            </div>

            <div class="d-flex align-center">
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="getEditItem(item)"
              >
                <EditSVG />
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="dialogQuestion = true"
              >
                <DeleteSVG />
              </v-btn>
            </div>
          </div>
        </template>
      </Table>
    </Card>
    <TransactionForm v-model="showForm" :data="selectedItem" />
    <DialogQuestion
      v-model="dialogQuestion"
      title="Apagar transação"
      text="Uma vez deletada não poderá recuperá-la!"
      color-confirm="red"
      text-confirm="Deletar"
      @cancel="dialogQuestion = false"
      @confirm="dialogQuestion = false"
    />
    <pre>{{ $transactions }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import moment from "moment";

const { mobile } = useDisplay();
const { amountFormated } = useUtils();
const transactionStore = useTransactionStore();

const showForm = ref(false);
const dialogQuestion = ref(false);
const selectedItem = ref<TransactionProps>();

const $transactions = computed(() => transactionStore.$all);

const headers = computed(() => {
  if (mobile.value) {
    return [{ title: "Descrição", key: "mobile" }];
  }
  return [
    // { title: "Emissão", key: "emissionDate" },
    { title: "Vence em", key: "dueDate" },
    { title: "Descrição", key: "title" },
    { title: "Tipo", key: "type" },
    //{ title: "Forma Pagamento", key: "paymentForm" },
    //{ title: "Parcela", key: "portion" },
    { title: "Valor", key: "amount" },
    //{ title: "Situação", key: "status" },
    { title: "", key: "actions" },
  ];
});

const returnTypeName = (type: string) => {
  if (type === "EXPENSE") return "Despesa";
  else if (type === "CREDIT") return "Crédito";
  else if (type === "INVESTMENT") return "Investimento";
  return "Desconhecido";
};

const returnTypeColor = (type: string) => {
  if (type === "EXPENSE") return "red";
  else if (type === "CREDIT") return "success";
  else if (type === "INVESTMENT") return "";
  return "";
};

const getPaymentFormName = (type: string) => {
  const paymentForm = paymentForms.find((item) => item.type === type);
  if (paymentForm) return paymentForm;

  return {
    name: "Desconhecido",
    type: "UNKNOWN",
    icon: "mdi-help-circle",
  };
};

const getEditItem = (item: TransactionProps) => {
  selectedItem.value = item;
  showForm.value = true;
};
</script>
