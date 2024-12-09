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
          <TextInput v-model="model.title" label="Título" required />
        </v-col>
        <v-col cols="12">
          <ClientProjectSelectSearch v-model="model.ClientProject" required />
        </v-col>
        <v-col cols="12" lg="6">
          <CurrencyInput v-model="model.value" label="Valor da hora" required />
        </v-col>
      </v-row>
    </FormCrud>
  </DrawerForm>
</template>

<script setup lang="ts">
import moment from "moment";
import { useForm } from "vee-validate";

const { handleReset } = useForm();
const props = defineProps({
  data: {
    type: Object as PropType<ServiceProps>,
    default: () => ({}),
  },
});
const drawer = defineModel({
  default: false,
});

const model = ref({
  id: 0,
  title: "",
  ClientProject: undefined as ClientProjectProps | undefined,
  serviceDate: moment().format("YYYY-MM-DD"),
  value: "",
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
    id: props.data.id ?? 0,
    title: props.data.title ?? "",
    ClientProject: props.data.ClientProject ?? undefined,
    value: props.data.hourValue ? props.data.hourValue.toFixed(2) : "",
    serviceDate: moment(props.data.serviceDate).format("YYYY-MM-DD"),
  };
};

// const validations = () => {
//   if (moment(model.value.due).isBefore(model.value.emission)) {
//     useNuxtApp().$toast.warn(
//       "A Data de vencimento não pode ser inferior a data de emissão!"
//     );

//     return false;
//   }

//   return true;
// };

const clearModel = () => {
  model.value = {
    id: 0,
    title: "",
    ClientProject: undefined as ClientProjectProps | undefined,
    value: "",
    serviceDate: moment().format("YYYY-MM-DD"),
  };
};

const handleDrawerModelValue = (value: boolean) => {
  if (!value) {
    handleReset();
    clearModel();
  }
};

const handleSubmit = async () => {
  clearModel();
  drawer.value = false;
};
</script>
