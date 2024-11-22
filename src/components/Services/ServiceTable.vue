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
                  {{ item.title }}
                </span>
              </template>
              <template #subtitle>
                <div class="d-flex flex-column" style="gap: 0.5rem">
                  {{ amountFormated(item.amount, true) }}
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
        <template v-slot:item.amount="{ item }">
          {{ amountFormated(item.amount, true) }}
        </template>
        <template v-slot:item.title="{ item }">
          <span>{{ item.title }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center" style="gap: 0.5rem">
              <v-icon
                :icon="getStatusIcon(item.status).icon"
                :color="getStatusIcon(item.status).color"
              />
              {{ getStatusToolTip(item.status) }}
            </div>

            <div class="d-flex align-center" style="gap: 0.5rem">
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
    <ServiceForm v-model="showForm" :data="fixedData" />
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
    { title: "Descrição", key: "title" },
    { title: "Valor", key: "amount" },
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

const items = ref([
  {
    id: 1,
    title: "Implementação do componente da inpart",
    status: "A",
    amount: 1000,
  },
  {
    id: 2,
    title: "Desenvolvimento de API",
    status: "F",
    amount: 2000,
  },
  {
    id: 3,
    title: "Manutenção de Sistema",
    status: "A",
    amount: 1500,
  },
  {
    id: 4,
    title: "Consultoria Técnica",
    status: "C",
    amount: 3000,
  },
  {
    id: 5,
    title: "Treinamento de Equipe",
    status: "A",
    amount: 1200,
  },
  {
    id: 6,
    title: "Análise de Dados",
    status: "F",
    amount: 2500,
  },
  {
    id: 7,
    title: "Desenvolvimento de Frontend",
    status: "A",
    amount: 1800,
  },
  {
    id: 8,
    title: "Desenvolvimento de Backend",
    status: "C",
    amount: 2200,
  },
  {
    id: 9,
    title: "Integração de Sistemas",
    status: "A",
    amount: 2700,
  },
  {
    id: 10,
    title: "Suporte Técnico",
    status: "F",
    amount: 1300,
  },
  {
    id: 11,
    title: "Desenvolvimento de Mobile App",
    status: "A",
    amount: 3200,
  },
  {
    id: 12,
    title: "Otimização de Performance",
    status: "C",
    amount: 2100,
  },
  {
    id: 13,
    title: "Desenvolvimento de E-commerce",
    status: "A",
    amount: 2900,
  },
  {
    id: 14,
    title: "Migração de Dados",
    status: "C",
    amount: 1700,
  },
  {
    id: 15,
    title: "Auditoria de Segurança",
    status: "A",
    amount: 2600,
  },
  {
    id: 16,
    title: "Desenvolvimento de Chatbot",
    status: "C",
    amount: 2400,
  },
  {
    id: 17,
    title: "Automação de Processos",
    status: "A",
    amount: 2800,
  },
  {
    id: 18,
    title: "Desenvolvimento de CRM",
    status: "C",
    amount: 3100,
  },
  {
    id: 19,
    title: "Desenvolvimento de ERP",
    status: "A",
    amount: 3500,
  },
  {
    id: 20,
    title: "Desenvolvimento de CMS",
    status: "C",
    amount: 2300,
  },
  {
    id: 21,
    title: "Desenvolvimento de BI",
    status: "A",
    amount: 3300,
  },
]);
</script>
