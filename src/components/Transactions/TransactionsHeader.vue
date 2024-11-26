<template>
  <div class="py-4">
    <v-row dense>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <Months class="w-50" @month="setLocalStorageMonth($event)" />
        <Button
          color="green"
          :block="mobile"
          @click="showForm = true"
          size="small"
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
        <SelectInput
          class="mt-4"
          v-model="filter.type"
          label="Tipo Transação"
          :items="$transactionTypes"
          item-title="name"
          item-value="type"
          density="comfortable"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <SelectInput
          class="mt-4"
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
      <v-col cols="12" lg="6">
        <TransactionChartMonth />
      </v-col>
      <v-col cols="12" lg="2">
        <TransactionCardResale />
      </v-col>
      <v-col cols="12" lg="2">
        <TransactionCardExpense />
      </v-col>
      <v-col cols="12" lg="2">
        <TransactionCardSalt />
      </v-col>
    </v-row>
    <!-- <v-row dense>
      <v-col cols="12" lg="6">
        <TransactionChartPaymentMethod />
      </v-col>
      <v-col cols="12" lg="6">
        <TransactionChartStatus />
      </v-col>
    </v-row> -->
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
const { getTransactions } = useUtils();
const showForm = ref(false);
const loading = ref(false);
const filter = ref({
  month: "",
  type: "ALL",
  paymentForm: "ALL",
});

const $transactionTypes = computed(() => {
  const tp = [];

  tp.push({ name: "Todas", type: "ALL" });

  transactionTypes.forEach((type) => {
    tp.push({ name: type.name, type: type.type });
  });

  return tp;
});
const $transactionPaymentForms = computed(() => {
  const tp = [];

  tp.push({ name: "Todas", type: "ALL" });

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
</script>
