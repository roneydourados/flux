import { defineStore } from "pinia";

interface FilterProps {
  initialDate?: string;
  finalDate?: string;
  clientProjectId?: number;
  clientId?: number;
  invoiced?: string;
}

export const useServiceStore = defineStore("service", () => {
  const { api } = useAxios();

  const services = ref<ServiceProps[]>([]);
  const service = ref<ServiceProps>();
  const serviceOcurrence = ref<ServiceOccurrenceProps>();

  const $all = computed(() => services.value);
  const $single = computed(() => service.value);
  const $serviceOcurrence = computed(() => serviceOcurrence.value);

  const index = async ({
    clientProjectId,
    finalDate,
    initialDate,
    clientId,
    invoiced,
  }: FilterProps) => {
    const config = {
      params: {
        clientProjectId,
        finalDate,
        initialDate,
        clientId,
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

  const saveServiceFilters = (filters: FilterProps) => {
    localStorage.setItem("serviceFilters", JSON.stringify(filters));
  };

  const clearFilters = () => {
    localStorage.removeItem("serviceFilters");
  };

  return {
    index,
    show,
    store,
    update,
    destroy,
    destroyServiceOccurrence,
    updateServiceOccurrence,
    saveServiceFilters,
    clearFilters,
    $all,
    $single,
    $serviceOcurrence,
  };
});
