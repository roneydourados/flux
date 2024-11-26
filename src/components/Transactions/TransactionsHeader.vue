<template>
  <div class="py-4">
    <v-row dense>
      <v-col cols="12" lg="9" class="d-flex flex-column">
        <Months
          class="w-100"
          @month="setLocalStorageMonth($event)"
          @year="setLocalStorageYear($event)"
        />
        <div class="d-flex flex-wrap align-center mt-4" style="gap: 0.5rem">
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
          <SelectInput
            v-model="filter.status"
            label="Situação"
            :items="transactionStatusItens"
            item-title="name"
            item-value="type"
            density="comfortable"
            variant="outlined"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="3" class="d-flex align-center justify-end">
        <Button
          color="green"
          :block="mobile"
          @click="showForm = true"
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
import { useDisplay } from "vuetify";

defineProps({
  title: {
    type: String,
    default: "",
  },
});

const { mobile } = useDisplay();
const { getTransactions } = useUtils();
const showForm = ref(false);
const loading = ref(false);
const filter = ref({
  month: "",
  type: "all",
  paymentForm: "all",
  status: "all",
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
</script>
