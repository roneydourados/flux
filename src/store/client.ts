import { defineStore } from "pinia";

export const useClientStore = defineStore("client", () => {
  const { api } = useAxios();

  const clients = ref<ClientProps[]>([]);
  const client = ref<ClientProps>();

  const $all = computed(() => clients.value);
  const $single = computed(() => client.value);

  const index = async (query?: string) => {
    const config = {
      params: {
        name: query,
      },
    };

    const resp = await api.get<ClientProps[]>("/clients", config);

    clients.value = resp.data;
  };

  const store = async (payload: ClientProps) => {
    const resp = await api.post("/clients", payload);

    client.value = resp.data;
  };

  const show = async (id: string) => {
    const resp = await api.get(`/clients/${id}`);

    client.value = resp.data;
  };

  const update = async (payload: ClientProps) => {
    const resp = await api.put(`/clients/${payload.publicId}`, payload);

    client.value = resp.data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/clients/${id}`);
  };

  const clearAll = () => {
    clients.value = [];
    client.value = undefined;
  };

  return {
    index,
    store,
    update,
    destroy,
    show,
    clearAll,
    $all,
    $single,
  };
});
