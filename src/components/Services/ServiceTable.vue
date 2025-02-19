<template>
  <div>
    <!-- <pre>{{ $allServices[0] }}</pre> -->
    <v-row>
      <v-col cols="12" lg="3" class="d-flex flex-wrap" style="gap: 0.5rem">
        <v-btn
          variant="flat"
          color="green"
          class="text-none"
          @click="showInvoice = true"
        >
          <v-icon icon="mdi-cash-check" start size="25" />
          Faturar
        </v-btn>
        <v-btn
          variant="flat"
          color="deep-orange"
          class="text-none"
          @click="showCancelInvoice = true"
        >
          <v-icon icon="mdi-reload-alert" size="25" start />
          Estornar
        </v-btn>
      </v-col>
    </v-row>
    <Table
      title="Serviços"
      :headers="headers"
      :items="$allServices"
      :items-per-page="10"
      :show-select="false"
      :show-crud="false"
      :loading="false"
      :show-pagination="true"
    >
      <template v-slot:item.title="{ item }">
        <ServiceTableItemExpantionPanel :item="item" />
      </template>
    </Table>
    <DialogLoading :dialog="loading" />
    <DialogQuestion
      title="Confirma faturamento ?"
      v-model="showInvoice"
      show-cancel
      :width="mobile ? '100%' : '500'"
      @confirm="handleInvoice"
      @cancel="showInvoice = false"
    >
      <v-row dense>
        <v-col cols="12">
          <CategorySelectSearch label="Informe categoria" v-model="category" />
        </v-col>
        <v-col cols="12">
          <PaymentMethodSelect
            label="Forma de pagamento"
            v-model="paymentMethod"
          />
        </v-col>
      </v-row>
    </DialogQuestion>

    <DialogQuestion
      title="Confirma estorno faturamento ?"
      v-model="showCancelInvoice"
      show-cancel
      @confirm="handleCancelInvoice"
      @cancel="showCancelInvoice = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const serviceStore = useServiceStore();

const { mobile } = useDisplay();
const { getFiltersStoreServices } = useUtils();
const { $toast } = useNuxtApp();

const $allServices = computed(() => serviceStore.$all);

const showInvoice = ref(false);
const showCancelInvoice = ref(false);
const loading = ref(false);
const category = ref<CategoryProps>();
const paymentMethod = ref("");
const headers = [
  {
    title: "",
    key: "title",
  },
];

const handleInvoice = async () => {
  showInvoice.value = false;
  loading.value = true;
  try {
    const filters = getFiltersStoreServices();

    if (!filters.Client) {
      $toast.warn("Cliente não selecionado");
      return;
    }

    if (!category.value) {
      $toast.warn("Categoria não selecionada");
      return;
    }

    if (!paymentMethod.value) {
      $toast.warn("Informe a forma de pagamento");
      return;
    }

    await serviceStore.invoiceServices({
      clientId: filters.Client?.id ?? 0,
      initialDate: filters.initialDate ?? "",
      finalDate: filters.finalDate ?? "",
      categoryId: category.value.id,
      paymentMethod: paymentMethod.value,
      invoiced: true,
    });

    await serviceStore.index({
      initialDate: filters.initialDate ?? "",
      finalDate: filters.finalDate ?? "",
      Client: filters.Client,
      invoiced: filters.invoiced,
    });
  } catch (error) {
    console.log("🚀 ~ handleInvoice ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancelInvoice = async () => {
  showCancelInvoice.value = false;
  loading.value = true;
  try {
    const filters = getFiltersStoreServices();

    if (!filters.Client) {
      $toast.warn("Cliente não selecionado");
      return;
    }

    await serviceStore.invoiceServices({
      clientId: filters.Client?.id ?? 0,
      initialDate: filters.initialDate ?? "",
      finalDate: filters.finalDate ?? "",
      invoiced: false,
    });

    await serviceStore.index({
      initialDate: filters.initialDate ?? "",
      finalDate: filters.finalDate ?? "",
      Client: filters.Client,
      invoiced: filters.invoiced,
    });
  } catch (error) {
    console.log("🚀 ~ handleCancelInvoice ~ error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
