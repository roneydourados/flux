import { defineStore } from "pinia";

export const useTransactionStore = defineStore("transaction", () => {
  const { api } = useAxios();
  const transactions = ref<TransactionProps[]>([]);
  const transaction = ref<TransactionProps>({});
  const transactionMonthChart = ref<TransactionChartMonthDayProps[]>([]);

  const $all = computed(() => transactions.value);
  const $single = computed(() => transaction.value);
  const $transactionMonthChart = computed(() => transactionMonthChart.value);

  const index = async ({
    initialDate,
    finalDate,
    status,
    categoryId,
  }: TransactionsFilterProps) => {
    const config = {
      params: {
        initialDate,
        finalDate,
        status,
        categoryId,
      },
    };

    const { data } = await api.get<TransactionProps[]>("/transaction", config);

    transactions.value = data;
  };

  const show = async (publicId: string) => {
    const { data } = await api.get<TransactionProps>(
      `/transaction/${publicId}`
    );
    transaction.value = data;
  };

  const create = async (payload: TransactionProps) => {
    const { data } = await api.post<TransactionProps>("/transaction", payload);
    transaction.value = data;
  };

  const update = async (payload: TransactionProps) => {
    const { data } = await api.put<TransactionProps>(
      `/transaction/${payload.publicId}`,
      payload
    );
    transaction.value = data;
  };

  const destroy = async (publicId: string) => {
    await api.delete(`/transaction/${publicId}`);
  };

  const chartMonth = async (input: {
    initialDate: string;
    finalDate: string;
  }) => {
    const { initialDate, finalDate } = input;
    const config = {
      params: {
        initialDate,
        finalDate,
      },
    };

    const { data } = await api.get<TransactionChartMonthDayProps[]>(
      "/transaction/chart-month-days",
      config
    );

    transactionMonthChart.value = data;
  };

  return {
    transactions,
    transaction,
    $all,
    $single,
    $transactionMonthChart,
    index,
    show,
    create,
    update,
    destroy,
    chartMonth,
  };
});
