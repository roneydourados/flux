import { defineStore } from "pinia";
import type { DashboardProps } from "~/interfaces/Dashboard";

export const useDashboardStore = defineStore("dashboard", () => {
  const { api } = useAxios();

  const dashboard = ref<DashboardProps>();
  const $dashboard = computed(() => dashboard.value);

  const index = async (input: { initialDate: string; finalDate: string }) => {
    const { initialDate, finalDate } = input;

    const config = {
      params: {
        initialDate,
        finalDate,
      },
    };

    const { data } = await api.get("/dashboard", config);

    dashboard.value = data;
  };

  return {
    index,
    $dashboard,
  };
});
