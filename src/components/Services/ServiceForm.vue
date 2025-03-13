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
          <TextInput v-model="model.title" label="Título" required rows="12" />
        </v-col>
        <v-col cols="12">
          <ClientProjectSelectSearch
            v-model="model.ClientProject"
            @update:model-value="getHourValue"
            required
          />
        </v-col>
        <v-col cols="12">
          <CurrencyInput v-model="model.value" label="Valor da hora" required />
        </v-col>
      </v-row>
    </FormCrud>
    <DialogLoading :dialog="loading" />
  </DrawerForm>
</template>

<script setup lang="ts">
import moment from "moment";
import { useForm } from "vee-validate";

const { handleReset } = useForm();
const serviceStore = useServiceStore();
const { getFiltersStoreServices } = useUtils();

const props = defineProps({
  data: {
    type: Object as PropType<ServiceProps>,
    default: () => ({}),
  },
});
const drawer = defineModel({
  default: false,
});

const loading = ref(false);
const model = ref({
  publicId: "",
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
    publicId: props.data.publicId ?? "",
    title: props.data.title ?? "",
    ClientProject: props.data.ClientProject ?? undefined,
    value: props.data.hourValue ? Number(props.data.hourValue).toFixed(2) : "",
    serviceDate: moment(props.data.serviceDate).format("YYYY-MM-DD"),
  };
};

const clearModel = () => {
  model.value = {
    publicId: "",
    title: "",
    ClientProject: undefined,
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
  if (isNaN(Number(model.value.value)) || Number(model.value.value) <= 0) {
    useNuxtApp().$toast.error("Valor da hora inválido!");
    return;
  }

  // if (Number(model.value.value) <= 0) {
  //   useNuxtApp().$toast.error("Valor da hora inválido!");
  //   return;
  // }

  loading.value = true;
  try {
    if (model.value.publicId) {
      await serviceStore.update({
        publicId: model.value.publicId,
        hourValue: Number(model.value.value),
        title: model.value.title,
        clientId: model.value.ClientProject?.clientId!,
        clientProjectId: model.value.ClientProject?.id!,
        serviceDate: moment().format("YYYY-MM-DD"),
      });
    } else {
      await serviceStore.store({
        hourValue: Number(model.value.value),
        title: model.value.title,
        clientId: model.value.ClientProject?.clientId!,
        clientProjectId: model.value.ClientProject?.id!,
        serviceDate: moment().format("YYYY-MM-DD"),
      });
    }

    await loadServices();
  } catch (error) {
  } finally {
    handleReset();
    clearModel();
    drawer.value = false;
    loading.value = false;
  }
};

const getHourValue = () => {
  model.value.value =
    model.value.ClientProject?.Client?.hourValueDefault?.toString()
      ? (
          Number(
            model.value.ClientProject?.Client?.hourValueDefault?.toString()
          ) * 100
        ).toString()
      : "";
};

const loadServices = async () => {
  const filters = getFiltersStoreServices();
  try {
    await serviceStore.index({
      initialDate: filters.initialDate,
      finalDate: filters.finalDate,
      ClientProject: filters.ClientProject,
      Client: filters.Client,
      invoiced: filters.invoiced,
    });
  } catch (error) {
    console.log("🚀 ~ handleDestroy ~ error:", error);
  }
};
</script>
