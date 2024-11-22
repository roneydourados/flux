<template>
  <DrawerForm
    v-model:drawer="drawer"
    title="Serviço"
    width="500"
    @update:drawer="handleDrawerModelValue($event)"
  >
    <FormCrud :on-submit="handleSubmit" :show-submit-button="true">
      <v-row dense class="pa-4">
        <v-col cols="12">
          <TransactionTypeSelect v-model="model.type" required />
        </v-col>
        <v-col cols="12">
          <CategorySelectSearch
            v-model="model.Category"
            show-new-button
            required
          />
        </v-col>
        <v-col cols="6">
          <DatePicker v-model="model.emission" label="Emissão" required />
        </v-col>
        <v-col cols="6">
          <DatePicker v-model="model.due" label="Vencimento" required />
        </v-col>
        <v-col cols="12">
          <StringInput v-model="model.name" label="Título" required />
        </v-col>
        <v-col cols="12" lg="6">
          <CurrencyInput v-model="model.value" label="Valor" required />
        </v-col>
        <v-col cols="12" lg="6"> </v-col>
        <v-col cols="12" lg="6">
          <v-checkbox
            v-model="model.fixed"
            label="Transação fixa"
            @update:model-value="validations"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <v-checkbox
            v-if="!data.id"
            v-model="model.isPortions"
            label="Parcelar ?"
            @update:model-value="validations"
          />
        </v-col>
        <v-col v-if="model.isPortions" cols="12" lg="4">
          <IntegerInput
            v-model="model.portions"
            label="Nº Parcelas"
            :required="model.isPortions"
            :disabled="model.fixed"
          />
        </v-col>
      </v-row>
      <!-- <pre>{{ model }}</pre> -->
    </FormCrud>
  </DrawerForm>
</template>

<script setup lang="ts">
import moment from "moment";
import { useForm } from "vee-validate";

const { handleReset } = useForm();
const props = defineProps({
  data: {
    type: Object as PropType<TransactionProps>,
    default: () => ({}),
  },
});
const drawer = defineModel({
  default: false,
});

const model = ref({
  id: 0,
  type: "",
  paymentForm: "",
  Category: undefined as CategoryProps | undefined,
  emission: moment().format("YYYY-MM-DD"),
  due: moment().add(30, "days").format("YYYY-MM-DD"),
  name: "",
  value: "",
  portions: "1",
  isPortions: false,
  fixed: false,
});

watch(
  () => drawer.value,
  () => {
    if (props.data.id && drawer.value) {
      loadModel();
    }
  }
);

const loadModel = () => {
  model.value = {
    id: props.data.id!,
    type: props.data.type!,
    paymentForm: props.data.paymentForm!,
    Category: props.data.Category,
    emission: moment(props.data.emisstionDate).format("YYYY-MM-DD"),
    due: moment(props.data.dueDate).format("YYYY-MM-DD"),
    name: props.data.name!,
    value: props.data.amount!.toString(),
    portions: props.data.portionTotal!.toString() ?? "1",
    isPortions: false,
    fixed: props.data.fixed ?? false,
  };
};

const validations = () => {
  if (model.value.fixed && model.value.isPortions) {
    useNuxtApp().$toast.warn("Os valores fixos não podem ser parcelados!");

    return false;
  }

  if (moment(model.value.due).isBefore(model.value.emission)) {
    useNuxtApp().$toast.warn(
      "A Data de vencimento não pode ser inferior a data de emissão!"
    );

    return false;
  }

  return true;
};

const clearModel = () => {
  model.value = {
    id: 0,
    type: "",
    Category: undefined,
    emission: moment().format("YYYY-MM-DD"),
    due: moment().add(30, "days").format("YYYY-MM-DD"),
    name: "",
    value: "",
    portions: "1",
    paymentForm: "",
    isPortions: false,
    fixed: false,
  };
};

const handleDrawerModelValue = (value: boolean) => {
  if (!value) {
    handleReset();
    clearModel();
  }
};

const handleSubmit = async () => {
  if (!validations()) return;

  clearModel();
  drawer.value = false;
};
</script>
