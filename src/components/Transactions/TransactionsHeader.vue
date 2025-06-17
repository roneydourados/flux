<template>
  <div class="py-4">
    <v-row>
      <v-col cols="12">
        <Months
          @month="updateDatesMonth($event)"
          @year="updateDatesYear($event)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        lg="6"
        class="d-flex flex-wrap align-center"
        style="gap: 0.5rem"
      >
        <DatePicker label="Data inicial" v-model="filter.initialDate" />
        <DatePicker label="Data final" v-model="filter.finalDate" />

        <SelectInput
          v-model="filter.type"
          label="Tipo Transação"
          :items="$transactionTypes"
          item-title="name"
          item-value="type"
          density="comfortable"
          variant="outlined"
        />
      </v-col>

      <v-col
        cols="12"
        lg="6"
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
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="4">
        <CategorySelectSearch v-model="filter.category" clearable />
      </v-col>
      <v-col cols="12" lg="3" class="d-flex align-center" style="gap: 0.5rem">
        <v-btn
          icon
          flat
          color="primary"
          size="small"
          @click="getTransactions"
          class="mt-n4"
        >
          <v-icon>mdi-reload</v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Atualiazar
          </v-tooltip>
        </v-btn>
        <!-- <Button
          color="green"
          @click="showForm = true"
          class="mt-n4"
          rounded="lg"
        >
          <strong class="mr-1" style="font-size: 0.8rem">+</strong>
          Nova Transação
          <v-icon icon="mdi-swap-vertical" end />
        </Button> -->
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

    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
//import { useDisplay } from "vuetify";

defineProps({
  title: {
    type: String,
    default: "",
  },
});

//const { mobile } = useDisplay();
const transactionStore = useTransactionStore();
//const { getTransactions } = useUtils();
const showForm = ref(false);
const loading = ref(false);
const filter = ref({
  month: "",
  type: "all",
  paymentForm: "all",
  status: "all",
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  category: undefined as CategoryProps | undefined,
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

const updateDatesMonth = async (month: number) => {
  const year = dayjs().year();
  const selectMonth = month < 10 ? `0${month + 1}` : (month + 1).toString();

  filter.value.initialDate = dayjs(`${year}-${selectMonth}`).format(
    "YYYY-MM-DD"
  );

  filter.value.finalDate = dayjs(filter.value.initialDate)
    .endOf("month")
    .format("YYYY-MM-DD");

  await getTransactions();
};

const updateDatesYear = async (year: number) => {
  const selectMonth = dayjs(filter.value.initialDate).format("MM");

  filter.value.initialDate = dayjs(`${year}-${selectMonth}-01`).format(
    "YYYY-MM-DD"
  );
  filter.value.finalDate = dayjs(filter.value.initialDate)
    .endOf("month")
    .format("YYYY-MM-DD");

  await getTransactions();
};

const getTransactions = async () => {
  loading.value = true;
  try {
    await transactionStore.index({
      initialDate: filter.value.initialDate,
      finalDate: filter.value.finalDate,
      status: filter.value.status,
      categoryId: filter.value.category?.id,
    });

    await transactionStore.chartMonth({
      initialDate: filter.value.initialDate,
      finalDate: filter.value.finalDate,
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
