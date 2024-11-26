import { defineStore } from "pinia";
import { useAxios } from "~/composables/Api";

export const useCategoryStore = defineStore("category", () => {
  const { api } = useAxios();
  const categories = ref<CategoryProps[]>([]);
  const $all = computed(() => categories.value);

  const index = async (name: string) => {
    categories.value = [];

    const config = {
      params: {
        name,
      },
    };

    const { data } = await api.get<CategoryProps[]>("/categories", config);

    categories.value = data;
  };

  return {
    index,
    $all,
  };
});
