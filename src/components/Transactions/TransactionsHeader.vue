<template>
  <div class="py-4">
    <v-row dense>
      <v-col
        cols="12"
        lg="4"
        class="d-flex flex-wrap align-center"
        style="gap: 0.5rem"
      >
        <DatePicker label="Data inicial" v-model="filter.initialDate" />
        <DatePicker label="Data final" v-model="filter.finalDate" />
      </v-col>
      <v-col
        cols="12"
        lg="4"
        class="d-flex flex-wrap align-center"
        style="gap: 0.5rem"
      >
        <SelectInput
          v-model="filter.type"
          label="Tipo Transação"
          :items="$transactionTypes"
          item-title="name"
          item-value="type"
          density="comfortable"
          variant="outlined"
        />
        <SelectInput
          v-model="filter.paymentForm"
          label="Forma pagamento"
          :items="$transactionPaymentForms"
          item-title="name"
          item-value="type"
          density="comfortable"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        cols="12"
        lg="8"
        class="d-flex flex-wrap align-center"
        style="gap: 0.5rem"
      >
        <SelectInput
          v-model="filter.paymentForm"
          label="Forma pagamento"
          :items="$transactionPaymentForms"
          item-title="name"
          item-value="type"
          density="comfortable"
          variant="outlined"
        />
        <SelectInput
          v-model="filter.status"
          label="Situação"
          :items="transactionStatusItens"
          item-title="name"
          item-value="type"
          density="comfortable"
          variant="outlined"
        />
        <v-btn
          icon
          flat
          color="primary"
          size="small"
          @click="getTransactions"
          class="mt-n4"
        >
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <Button
          color="green"
          :block="mobile"
          @click="showForm = true"
          class="mt-n4"
          rounded="lg"
        >
          <strong class="mr-1" style="font-size: 0.8rem">+</strong> Adicionar
          Transação
          <v-icon icon="mdi-swap-vertical" end />
        </Button>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" lg="6">
        <TransactionChartMonth />
      </v-col>
      <v-col cols="12" lg="3" class="d-flex flex-column" style="gap: 0.5rem">
        <TransactionCardResale />
        <TransactionCardExpense />
      </v-col>
      <v-col cols="12" lg="3" class="d-flex flex-column" style="gap: 0.5rem">
        <TransactionCardInvestment />
        <TransactionCardSalt />
      </v-col>
    </v-row>
    <TransactionForm v-model="showForm" />
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
const transactionStore = useTransactionStore();
//const { getTransactions } = useUtils();
const showForm = ref(false);
const loading = ref(false);
const filter = ref({
  month: "",
  type: "all",
  paymentForm: "all",
  status: "all",
  initialDate: moment().startOf("month").format("YYYY-MM-DD"),
  finalDate: moment().endOf("month").format("YYYY-MM-DD"),
});

const transactionStatusItens = [
  { name: "Todas", type: "all" },
  { name: "Pendente", type: "A" },
  { name: "Paga", type: "P" },
];

const $transactionTypes = computed(() => {
  const tp = [];

  tp.push({ name: "Todas", type: "all" });

  transactionTypes.forEach((type) => {
    tp.push({ name: type.name, type: type.type });
  });

  return tp;
});
const $transactionPaymentForms = computed(() => {
  const tp = [];

  tp.push({ name: "Todas", type: "all" });

  paymentForms.forEach((type) => {
    tp.push({ name: type.name, type: type.type });
  });

  return tp;
});

const getTransactions = async () => {
  loading.value = true;
  try {
    await transactionStore.index({
      initialDate: filter.value.initialDate,
      finalDate: filter.value.finalDate,
      status: filter.value.status,
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

/*
const setLocalStorageMonth = async (month: number) => {
  localStorage.setItem("month_transaction", month.toString());
  try {
    loading.value = true;
    await getTransactions();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const setLocalStorageYear = async (year: number) => {
  localStorage.setItem("year_transaction", year.toString());
  try {
    loading.value = true;
    //await getTransactions();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
*/
</script>
