<template>
  <div class="py-4">
    <v-row dense>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <Months class="w-50" />
        <Button
          color="green"
          :block="mobile"
          @click="showForm = true"
          size="small"
          rounded="lg"
        >
          <strong class="mr-1" style="font-size: 0.8rem">+</strong>
          Adicionar Serviço
          <v-icon icon="mdi-account-wrench-outline" end />
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
          variant="outlined"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <ServiceChartMonth />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="6">
        <ServiceChartProject />
      </v-col>
      <v-col cols="12" lg="6">
        <ServiceChartStatus />
      </v-col>
    </v-row>
    <ServiceForm v-model="showForm" />
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
