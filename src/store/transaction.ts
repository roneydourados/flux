import { defineStore } from "pinia";

export const useTransactionStore = defineStore("transaction", () => {
  const { api } = useAxios();
  const transactions = ref<TransactionProps[]>([]);
  const transaction = ref<TransactionProps>({});
  const $all = computed(() => transactions.value);
  const $single = computed(() => transaction.value);

  const index = async ({
    initialDate,
    finalDate,
    status,
  }: TransactionsFilterProps) => {
    const config = {
      params: {
        initialDate,
        finalDate,
        status,
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

  return {
    transactions,
    transaction,
    $all,
    $single,
    index,
    show,
    create,
    update,
    destroy,
  };
});
