import { defineStore } from "pinia";

export const useServiceStore = defineStore("service", () => {
  const { api } = useAxios();

  const services = ref<ServiceProps[]>([]);
  const service = ref<ServiceProps>();
  const serviceOcurrence = ref<ServiceOccurrenceProps>();

  const $all = computed(() => services.value);
  const $single = computed(() => service.value);
  const $serviceOcurrence = computed(() => serviceOcurrence.value);

  const index = async ({
    ClientProject,
    finalDate,
    initialDate,
    Client,
    invoiced,
  }: ServiceFilterProps) => {
    const config = {
      params: {
        clientProjectId: ClientProject?.id,
        finalDate,
        initialDate,
        clientId: Client?.id,
        invoiced,
      },
    };

    const { data } = await api.get("/services", config);
    services.value = data;
  };

  const show = async (id: number) => {
    const { data } = await api.get(`/services/${id}`);
    service.value = data;
  };

  const store = async (payload: ServiceProps) => {
    const { data } = await api.post("/services", payload);
    service.value = data;
  };

  const update = async (payload: ServiceProps) => {
    const { data } = await api.put(`/services/${payload.publicId}`, payload);
    service.value = data;
  };

  const destroy = async (publicId: string) => {
    await api.delete(`/services/${publicId}`);
  };

  const destroyServiceOccurrence = async (publicId: string) => {
    await api.delete(`/service-occurrences/${publicId}`);
  };

  const updateServiceOccurrence = async (payload: ServiceOccurrenceProps) => {
    await api.put(`/service-occurrences/${payload.publicId}`, payload);
  };

  const invoiceServices = async (input: {
    initialDate: string;
    finalDate: string;
    clientId: number;
    invoiced: boolean;
  }) => {
    await api.put("/services/invoice", input);
  };

  return {
    index,
    show,
    store,
    update,
    destroy,
    destroyServiceOccurrence,
    updateServiceOccurrence,
    invoiceServices,
    $all,
    $single,
    $serviceOcurrence,
  };
});
