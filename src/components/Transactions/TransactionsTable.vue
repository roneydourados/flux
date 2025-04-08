<template>
  <div>
    <Table
      title="Transações"
      :headers="headers"
      :items="$transactions"
      :items-per-page="10"
      :show-select="false"
      :show-crud="false"
      :loading="false"
      :show-pagination="true"
    >
      <template v-if="mobile" v-slot:item.mobile="{ item }">
        <v-list density="compact" rounded="lg">
          <v-list-item density="compact">
            <template #title>
              <span style="width: 0.5rem">
                {{ item.title }}
              </span>
            </template>
            <template #subtitle>
              <div class="d-flex flex-column">
                <span class="mr-2">
                  Parc. {{ item.portion }}/{{ item.portionTotal }}
                </span>
                <div
                  class="d-flex align-center justify-space-between w-100 mt-4"
                >
                  <div class="d-flex align-center">
                    <v-icon
                      :icon="
                        item.status === 'A'
                          ? 'mdi-circle-outline'
                          : 'mdi-check-circle-outline'
                      "
                      :color="item.status === 'A' ? 'grey' : 'green'"
                      start
                    />
                    <span>
                      {{ item.status === "A" ? "Pendente" : "Pago" }}
                    </span>
                  </div>
                  <span>{{ amountFormated(item.amount, true) }}</span>
                </div>
              </div>
            </template>

            <template #append>
              <div class="d-flex align-center" style="gap: 0.5rem">
                <v-btn
                  v-if="item.status === 'A'"
                  icon
                  variant="text"
                  size="small"
                  @click="getDownItem(item)"
                >
                  <DownTransactionSVG height="20" />
                </v-btn>
                <v-btn
                  v-if="item.status === 'P'"
                  icon
                  variant="text"
                  size="small"
                  @click="getCancelDownItem(item)"
                >
                  <v-icon
                    icon="mdi-flip-to-back"
                    color="grey-darken-1"
                    size="24"
                  />
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="getEditItem(item)"
                >
                  <EditSVG />
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="getDeleteItem(item)"
                >
                  <DeleteSVG />
                </v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </template>
      <template v-slot:item.amount="{ item }">
        {{ amountFormated(item.amount, true) }}
      </template>
      <!-- <template v-slot:item.emissionDate="{ item }">
          {{ moment(item.emissonDate).format("DD/MM/YYYY") }}
        </template> -->
      <template v-slot:item.dueDate="{ item }">
        {{ formatDate(item.dueDate) }}
      </template>
      <template v-slot:item.Category="{ item }">
        <div
          :color="returnTypeColor(item.type)"
          class="d-flex align-center px-4"
        >
          <v-icon
            icon="mdi-circle"
            size="12"
            start
            :color="returnTypeColor(item.type)"
          />
          <span>
            {{ item.Category.categoryName }}
          </span>
        </div>
      </template>
      <template v-slot:item.portion="{ item }">
        {{ item.portion }}/{{ item.portionTotal }}
      </template>
      <template v-slot:item.name="{ item }">
        <div class="d-flex flex-column" style="gap: 0.5rem">
          <span>{{ item.name }}</span>
          <div class="d-flex align-center" style="font-size: 0.7rem">
            <v-icon :icon="getPaymentFormName(item.paymentForm).icon" start />
            <span style="color: #e0e0e0">
              {{ getPaymentFormName(item.paymentMethod).name }}
            </span>
          </div>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <div
          class="d-flex align-center justify-space-between"
          style="gap: 0.5rem"
        >
          <div class="d-flex align-center">
            <v-icon
              :icon="
                item.status === 'A'
                  ? 'mdi-circle-outline'
                  : 'mdi-check-circle-outline'
              "
              :color="item.status === 'A' ? 'grey' : 'green'"
              start
            />
            <span>{{ item.status === "A" ? "Pendente" : "Pago" }}</span>
          </div>

          <div class="d-flex align-center">
            <v-btn
              v-if="item.status === 'A'"
              icon
              variant="text"
              size="small"
              @click="getDownItem(item)"
            >
              <DownTransactionSVG height="20" />
              <v-tooltip activator="parent" location="bottom center">
                Liquidar
              </v-tooltip>
            </v-btn>
            <v-btn
              v-if="item.status === 'P'"
              icon
              variant="text"
              size="small"
              @click="getCancelDownItem(item)"
            >
              <v-icon icon="mdi-flip-to-back" color="grey-darken-1" size="24" />
              <v-tooltip activator="parent" location="bottom center">
                Estornar
              </v-tooltip>
            </v-btn>
            <v-btn icon variant="text" size="small" @click="getEditItem(item)">
              <v-tooltip activator="parent" location="bottom center">
                Editar/Detalhar
              </v-tooltip>
              <EditSVG />
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              @click="getDeleteItem(item)"
            >
              <v-tooltip activator="parent" location="bottom center">
                Apagar
              </v-tooltip>
              <DeleteSVG />
            </v-btn>
          </div>
        </div>
      </template>
    </Table>

    <TransactionForm v-model="showForm" :data="selectedItem" />
    <DialogQuestion
      v-model="dialogQuestion"
      title="Apagar transação"
      text="Uma vez deletada não poderá recuperá-la!"
      color-confirm="red"
      text-confirm="Deletar"
      @cancel="dialogQuestion = false"
      @confirm="handleDeleteTransaction"
    />
    <DialogQuestion
      v-model="dialogDownQuestion"
      title="Liquidar/Quitar transação"
      text="Confirmar liquidação/quitação de transação!"
      color-confirm="info"
      text-confirm="Liquidar"
      @cancel="dialogDownQuestion = false"
      @confirm="handleDownTransaction"
    />
    <DialogQuestion
      v-model="dialogCancelDownQuestion"
      title="Estornar liquidação ?"
      text="Confirmar estorno de liquidação/quitação de transação!"
      color-confirm="info"
      text-confirm="Estornar"
      @cancel="dialogCancelDownQuestion = false"
      @confirm="handleCancelDownTransaction"
    />
    <DialogLoading :dialog="loading" />
    <!-- <pre>{{ $transactions }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import moment from "moment";

const { mobile } = useDisplay();
const { amountFormated, getTransactions, formatDate } = useUtils();
const transactionStore = useTransactionStore();

const showForm = ref(false);
const dialogQuestion = ref(false);
const dialogDownQuestion = ref(false);
const dialogCancelDownQuestion = ref(false);
const loading = ref(false);
const selectedItem = ref<TransactionProps>();

const $transactions = computed(() => transactionStore.$all);

const headers = computed(() => {
  if (mobile.value) {
    return [{ title: "Descrição", key: "mobile" }];
  }
  return [
    { title: "Data", key: "dueDate" },
    { title: "Descrição", key: "title" },
    { title: "Parc.", key: "portion" },
    { title: "Categoria", key: "Category" },
    { title: "Valor", key: "amount" },
    { title: "", key: "actions" },
  ];
});

// const returnTypeName = (type: string) => {
//   if (type === "EXPENSE") return "Despesa";
//   else if (type === "CREDIT") return "Crédito";
//   else if (type === "INVESTMENT") return "Investimento";
//   return "Desconhecido";
// };

const returnTypeColor = (type: string) => {
  if (type === "EXPENSE") return "red";
  else if (type === "CREDIT") return "success";
  else if (type === "INVESTMENT") return "";
  return "";
};

const getPaymentFormName = (type: string) => {
  const paymentForm = paymentForms.find((item) => item.type === type);
  if (paymentForm) return paymentForm;

  return {
    name: "Desconhecido",
    type: "UNKNOWN",
    icon: "mdi-help-circle",
  };
};

const getEditItem = (item: TransactionProps) => {
  selectedItem.value = item;
  showForm.value = true;
};

const getDownItem = (item: TransactionProps) => {
  selectedItem.value = item;

  if (selectedItem.value?.status === "P") {
    useNuxtApp().$toast.warn("Transação já liquidada!");
    selectedItem.value = {};
    return;
  }

  dialogDownQuestion.value = true;
};

const getCancelDownItem = (item: TransactionProps) => {
  selectedItem.value = item;

  if (selectedItem.value?.status === "A") {
    useNuxtApp().$toast.warn("Transação não esta liquidada!");
    selectedItem.value = {};
    return;
  }

  dialogCancelDownQuestion.value = true;
};

const getDeleteItem = (item: TransactionProps) => {
  selectedItem.value = item;
  dialogQuestion.value = true;
};

const handleDeleteTransaction = async () => {
  dialogQuestion.value = false;
  if (selectedItem.value?.publicId) {
    loading.value = true;
    try {
      await transactionStore.destroy(selectedItem.value.publicId);
      await getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
};

const handleDownTransaction = async () => {
  dialogDownQuestion.value = false;
  if (selectedItem.value?.publicId) {
    loading.value = true;
    try {
      await transactionStore.update({
        ...selectedItem.value,
        status: "P",
      });

      await getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
};

const handleCancelDownTransaction = async () => {
  dialogCancelDownQuestion.value = false;
  if (selectedItem.value?.publicId) {
    loading.value = true;
    try {
      await transactionStore.update({
        ...selectedItem.value,
        status: "A",
      });

      await getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
};
</script>
