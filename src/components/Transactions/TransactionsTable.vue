<template>
  <div>
    <Card>
      <Table
        title=""
        :headers="headers"
        :items="items"
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
                  {{ item.name }}
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
                {{ getPaymentFormName(item.paymentForm).name }}
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
                @click="showForm = true"
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
    <TransactionForm v-model="showForm" :data="fixedData" />
    <DialogQuestion
      v-model="dialogQuestion"
      title="Apagar transação"
      text="Uma vez deletada não poderá recuperá-la!"
      color-confirm="red"
      text-confirm="Deletar"
      @cancel="dialogQuestion = false"
      @confirm="dialogQuestion = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import moment from "moment";

const { mobile } = useDisplay();
const { amountFormated } = useUtils();

const showForm = ref(false);
const dialogQuestion = ref(false);
const selectedItem = ref<TransactionProps>();

const headers = computed(() => {
  if (mobile.value) {
    return [{ title: "Descrição", key: "mobile" }];
  }
  return [
    // { title: "Emissão", key: "emissionDate" },
    { title: "Vence em", key: "dueDate" },
    { title: "Descrição", key: "name" },
    { title: "Tipo", key: "type" },
    //{ title: "Forma Pagamento", key: "paymentForm" },
    //{ title: "Parcela", key: "portion" },
    { title: "Valor", key: "amount" },
    //{ title: "Situação", key: "status" },
    { title: "", key: "actions" },
  ];
});

const fixedData = ref({
  id: 1,
  type: "CREDIT",
  Category: {
    id: 1,
    userId: 1,
    name: "Hospedagem",
    icon: "mdi-home-outline",
    color: "",
    createdAt: "2024-11-12T20:48:31.629Z",
    updatedAt: "2024-11-12T20:48:31.629Z",
  },
  emissionDate: "2024-11-14",
  dueDate: "2024-12-14",
  name: "Teste",
  paymentForm: "PIX",
  amount: 1.23,
  portionTotal: 1,
  isPortions: false,
  fixed: false,
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
  showForm.value = true;
  selectedItem.value = item;
};

const items = ref([
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-01",
    dueDate: "2024-12-01",
    type: "INVESTMENT",
    status: "p",
    name: "Compra de Notebook",
    amount: 598,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-02",
    dueDate: "2024-12-02",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Celular",
    amount: 1200,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-03",
    dueDate: "2024-12-03",
    type: "CREDIT",
    status: "A",
    name: "Compra de TV",
    amount: 2500,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-04",
    dueDate: "2024-12-04",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Geladeira",
    amount: 1800,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-05",
    dueDate: "2024-12-05",
    type: "CREDIT",
    status: "A",
    name: "Compra de Fogão",
    amount: 900,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-06",
    dueDate: "2024-12-06",
    type: "EXPENSE",
    status: "p",
    name: "Compra de Microondas",
    amount: 400,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-07",
    dueDate: "2024-12-07",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Lavar",
    amount: 1500,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-08",
    dueDate: "2024-12-08",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Secadora",
    amount: 1300,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-09",
    dueDate: "2024-12-09",
    type: "CREDIT",
    status: "A",
    name: "Compra de Lava-louças",
    amount: 1100,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-10",
    dueDate: "2024-12-10",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Ar-condicionado",
    amount: 2000,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-11",
    dueDate: "2024-12-11",
    type: "CREDIT",
    status: "A",
    name: "Compra de Ventilador",
    amount: 300,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-12",
    dueDate: "2024-12-12",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Aquecedor",
    amount: 700,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-13",
    dueDate: "2024-12-13",
    type: "CREDIT",
    status: "A",
    name: "Compra de Aspirador de Pó",
    amount: 500,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-14",
    dueDate: "2024-12-14",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Ferro de Passar",
    amount: 200,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-15",
    dueDate: "2024-12-15",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Costura",
    amount: 800,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-16",
    dueDate: "2024-12-16",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Liquidificador",
    amount: 150,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-17",
    dueDate: "2024-12-17",
    type: "CREDIT",
    status: "A",
    name: "Compra de Batedeira",
    amount: 250,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-18",
    dueDate: "2024-12-18",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Torradeira",
    amount: 100,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-19",
    dueDate: "2024-12-19",
    type: "CREDIT",
    status: "A",
    name: "Compra de Cafeteira",
    amount: 350,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-20",
    dueDate: "2024-12-20",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Panela Elétrica",
    amount: 400,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-21",
    dueDate: "2024-12-21",
    type: "CREDIT",
    status: "A",
    name: "Compra de Fritadeira",
    amount: 450,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-22",
    dueDate: "2024-12-22",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Grill",
    amount: 300,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-23",
    dueDate: "2024-12-23",
    type: "CREDIT",
    status: "A",
    name: "Compra de Forno Elétrico",
    amount: 600,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-24",
    dueDate: "2024-12-24",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Fogão Elétrico",
    amount: 700,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-25",
    dueDate: "2024-12-25",
    type: "CREDIT",
    status: "A",
    name: "Compra de Churrasqueira Elétrica",
    amount: 500,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-26",
    dueDate: "2024-12-26",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Pão",
    amount: 600,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-27",
    dueDate: "2024-12-27",
    type: "CREDIT",
    status: "A",
    name: "Compra de Sorveteira",
    amount: 400,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-28",
    dueDate: "2024-12-28",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Waffle",
    amount: 200,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-29",
    dueDate: "2024-12-29",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Crepe",
    amount: 300,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-11-30",
    dueDate: "2024-12-30",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Pipoca",
    amount: 150,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-01",
    dueDate: "2025-01-01",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Algodão Doce",
    amount: 250,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-02",
    dueDate: "2025-01-02",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Sorvete",
    amount: 500,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-03",
    dueDate: "2025-01-03",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Café Expresso",
    amount: 800,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-04",
    dueDate: "2025-01-04",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Suco",
    amount: 300,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-05",
    dueDate: "2025-01-05",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Milkshake",
    amount: 400,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-06",
    dueDate: "2025-01-06",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Smoothie",
    amount: 350,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-07",
    dueDate: "2025-01-07",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Chá",
    amount: 200,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-08",
    dueDate: "2025-01-08",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Cappuccino",
    amount: 300,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-09",
    dueDate: "2025-01-09",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Chocolate Quente",
    amount: 250,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-10",
    dueDate: "2025-01-10",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Chá Gelado",
    amount: 150,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-11",
    dueDate: "2025-01-11",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Água",
    amount: 100,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-12",
    dueDate: "2025-01-12",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Refrigerante",
    amount: 200,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-13",
    dueDate: "2025-01-13",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Cerveja",
    amount: 500,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-14",
    dueDate: "2025-01-14",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Vinho",
    amount: 600,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-15",
    dueDate: "2025-01-15",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Whisky",
    amount: 700,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-16",
    dueDate: "2025-01-16",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Vodka",
    amount: 800,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-17",
    dueDate: "2025-01-17",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Rum",
    amount: 900,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-18",
    dueDate: "2025-01-18",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Gin",
    amount: 1000,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-19",
    dueDate: "2025-01-19",
    type: "CREDIT",
    status: "A",
    name: "Compra de Máquina de Tequila",
    amount: 1100,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
  {
    portion: 1,
    portionTotal: 3,
    emissionDate: "2024-12-20",
    dueDate: "2025-01-20",
    type: "EXPENSE",
    status: "A",
    name: "Compra de Máquina de Cachaça",
    amount: 1200,
    fixed: false,
    paymentForm: "CREDIT_CARD",
  },
]);
</script>
