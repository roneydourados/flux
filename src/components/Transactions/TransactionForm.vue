<template>
  <DrawerForm
    v-model:drawer="drawer"
    title="Transação"
    width="500"
    @update:drawer="handleDrawerModelValue($event)"
  >
    <FormCrud
      :on-submit="handleSubmit"
      :show-submit-button="model.status !== 'P'"
    >
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
          <DatePicker v-model="model.due" label="Data/Vencimento" required />
        </v-col>
        <v-col cols="12" lg="6">
          <PaymentMethodSelect v-model="model.paymentMethod" required />
        </v-col>
        <v-col cols="12">
          <StringInput v-model="model.name" label="Título" required />
        </v-col>
        <v-col cols="12" lg="6">
          <CurrencyInput v-model="model.value" label="Valor" required />
        </v-col>
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

      <!-- <template #button>
        <Button
          color="info"
          @click="getTransactionDown"
          rounded="xl"
          class="ml-2"
        >
          <DownTransactionSVG height="20" color="#fff" class="mr-2" />
          <span style="font-size: 1rem"> Liquidar </span>
        </Button>
      </template> -->
    </FormCrud>
    <DialogLoading :dialog="loading" />
    <DialogQuestion
      v-model="dialogQuestion"
      title="Liquidar/Quitar transação"
      text="Confirmar liquidação/quitação de transação!"
      color-confirm="info"
      text-confirm="Liquidar"
      @cancel="dialogQuestion = false"
      @confirm="handleLiquidTransaction"
    />
  </DrawerForm>
</template>

<script setup lang="ts">
import moment from "moment";
import { useForm } from "vee-validate";

const { handleReset } = useForm();
const { amountFormated, getTransactions } = useUtils();
const transactionStore = useTransactionStore();

const props = defineProps({
  data: {
    type: Object as PropType<TransactionProps>,
    default: () => ({}),
  },
});

const emit = defineEmits(["submit"]);
const loading = ref(false);
const dialogQuestion = ref(false);
const drawer = defineModel({
  default: false,
});

const model = ref({
  publicId: "",
  type: "",
  paymentMethod: "",
  Category: undefined as CategoryProps | undefined,
  emission: moment().format("YYYY-MM-DD"),
  due: moment().format("YYYY-MM-DD"),
  name: "",
  value: "",
  portions: "1",
  status: "A",
  isPortions: false,
  fixed: false,
});

watch(
  () => drawer.value,
  () => {
    if (props.data.publicId && drawer.value) {
      loadModel();
    }
  }
);

const loadModel = () => {
  model.value = {
    publicId: props.data.publicId!,
    type: props.data.type!,
    paymentMethod: props.data.paymentMethod!,
    Category: props.data.Category,
    emission: moment(props.data.emisstionDate).format("YYYY-MM-DD"),
    due: moment(props.data.dueDate).format("YYYY-MM-DD"),
    name: props.data.title!,
    value: amountFormated(props.data.amount!, false),
    portions: "1", //props.data.portionTotal!.toString() ?? "1",
    isPortions: false,
    status: props.data.status!,
    fixed: props.data.fixed ?? false,
  };
};

const validations = () => {
  if (model.value.fixed && model.value.isPortions) {
    useNuxtApp().$toast.warn("Os valores fixos não podem ser parcelados!");

    return false;
  }

  // if (moment(model.value.due).isBefore(model.value.emission)) {
  //   useNuxtApp().$toast.warn(
  //     "A Data de vencimento não pode ser inferior a data de emissão!"
  //   );

  //   return false;
  // }

  if (parseFloat(model.value.value) < 0) {
    useNuxtApp().$toast.warn("O valor não pode ser negativo!");
    return false;
  }

  return true;
};

const clearModel = () => {
  model.value = {
    publicId: "",
    type: "",
    Category: undefined,
    emission: moment().format("YYYY-MM-DD"),
    due: moment().format("YYYY-MM-DD"),
    name: "",
    value: "",
    portions: "1",
    paymentMethod: "",
    isPortions: false,
    fixed: false,
    status: "A",
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

  loading.value = true;
  try {
    if (props.data.publicId) {
      await update();
    } else {
      await create();
    }

    await getTransactions();

    clearModel();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
    drawer.value = false;
  }
};

const create = async () => {
  await transactionStore.create({
    amount: parseFloat(model.value.value),
    categoryId: model.value.Category?.id!,
    dueDate: model.value.due,
    fixed: model.value.fixed,
    emisstionDate: model.value.emission,
    paymentMethod: model.value.paymentMethod,
    title: model.value.name,
    type: model.value.type,
    status: model.value.status,
    portionTotal: parseInt(model.value.portions),
    portion: 1,
  });
};

const update = async () => {
  await transactionStore.update({
    publicId: props.data.publicId!,
    amount: parseFloat(model.value.value),
    categoryId: model.value.Category?.id!,
    dueDate: model.value.due,
    fixed: model.value.fixed,
    emisstionDate: model.value.emission,
    paymentMethod: model.value.paymentMethod,
    title: model.value.name,
    type: model.value.type,
    status: model.value.status,
    // portionTotal: parseInt(model.value.portions),
    // portion: 1,
  });
};

const handleLiquidTransaction = async () => {
  if (props.data.publicId) {
    loading.value = true;
    try {
      model.value = {
        ...model.value,
        status: "P",
      };

      await update();
      await getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
      dialogQuestion.value = false;
      drawer.value = false;
    }
  }
};

const getTransactionDown = () => {
  if (props.data.status === "P") {
    useNuxtApp().$toast.warn("Transação já liquidada!");
    return;
  }
  dialogQuestion.value = true;
};
</script>
