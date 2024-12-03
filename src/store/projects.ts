import { defineStore } from "pinia";

export const useProjectsStore = defineStore("projects", () => {
  const { api } = useAxios();

  const projects = ref<ClientProjectProps[]>([]);
  const project = ref<ClientProjectProps>();

  const $all = computed(() => projects.value);
  const $single = computed(() => project.value);

  const index = async (name?: string, clientId?: number) => {
    const config = {
      params: {
        name,
        clientId,
      },
    };

    const { data } = await api.get<ClientProjectProps[]>(
      "/client-projects",
      config
    );

    projects.value = data;
  };

  const store = async (payload: ClientProjectProps) => {
    const { data } = await api.post<ClientProjectProps>(
      "/client-projects",
      payload
    );
    project.value = data;
  };

  const show = async (id: number) => {
    const { data } = await api.get<ClientProjectProps>(
      `/client-projects/${id}`
    );

    project.value = data;
  };

  const update = async (payload: ClientProjectProps) => {
    const { data } = await api.put<ClientProjectProps>(
      `/client-projects/${payload.id}`,
      payload
    );

    project.value = data;
  };

  const clearStore = () => {
    project.value = undefined;
    projects.value = [];
  };

  const destroy = async (id: number) => {
    await api.delete(`/client-projects/${id}`);
  };

  return { index, show, store, update, destroy, clearStore, $all, $single };
});
