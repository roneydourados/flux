<template>
  <div class="py-4">
    <v-row dense>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <!--
        <h3 style="font-weight: 100">{{ title }}</h3>
         <MenuButton
          :block="mobile"
          :items="menuMonthItems"
          variant="outlined"
          color="greylight"
          size="small"
        >
          Selcionar Mês
        </MenuButton> -->
        <Months class="w-50" />
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
      <!-- <v-col cols="12">
        <Button
          color="green"
          :block="mobile"
          @click="showForm = true"
          size="small"
          rounded="lg"
        >
          Adicionar Transação
          <v-icon icon="mdi-swap-vertical" end />
        </Button>
      </v-col> -->
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
      <v-col cols="12">
        <TransactionChartMonth />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="6">
        <TransactionChartPaymentMethod />
      </v-col>
      <v-col cols="12" lg="6">
        <TransactionChartStatus />
      </v-col>
    </v-row>
    <TransactionForm v-model="showForm" />
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
const showForm = ref(false);
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
const menuMonthItems = computed(() => {
  return months.map((month) => {
    return {
      title: month.monthFull,
      icon: "",
      iconColor: "",
    };
  });
});
</script>
