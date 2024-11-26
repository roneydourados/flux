<template>
  <div class="d-flex flex-wrap align-center w-100" style="gap: 1rem">
    <AutoCompleteInput
      v-model="value"
      v-model:search="search"
      :label="label"
      placeholder="Digite algo para pesquisar..."
      item-title="categoryName"
      return-object
      :required="required"
      icon="mdi-magnify"
      :items="$all"
      :loading="loadingSearch"
      @click="search = ''"
      @update:model-value="$emit('update:modelValue', $event)"
      :clearable="clearable"
      :disabled="disabled"
    >
      <template #items="{ item, props }">
        <v-list-item v-bind="props" density="compact">
          <template #title>
            <span>{{ item.raw.categoryName }}</span>
          </template>
          <template #prepend>
            <v-icon :icon="item.raw.icon" :color="item.raw.color" />
          </template>
          <template #append>
            <v-btn
              icon
              variant="text"
              size="small"
              @click="handleEdit(item.raw)"
            >
              <EditSVG />
            </v-btn>
          </template>
        </v-list-item>
      </template>

      <template #selection="{ item }">
        <div class="d-flex align-center">
          <span class="ml-2 d-inline-block text-truncate" style="width: 95%">
            <v-icon :icon="item.raw.icon" :color="item.raw.color" start />
            {{ item.raw.categoryName }}
          </span>
        </div>
      </template>
    </AutoCompleteInput>

    <div v-if="showNewButton" class="mt-n6">
      <v-tooltip text="Nova categoria" content-class="tooltip-background">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-plus"
            size="small"
            color="green"
            flat
            @click="showForm = true"
          />
        </template>
      </v-tooltip>
    </div>
    <CategoryForm v-model="showForm" :data="selected" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Categoria",
  },
  cleareable: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clientId: {
    type: Number,
    default: 0,
  },
  showNewButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const category = useCategoryStore();

const search = ref("");
const loadingSearch = ref(false);
const showForm = ref(false);

const value = defineModel<CategoryProps>({
  default: undefined,
});

const selected = ref<CategoryProps>();
const $all = computed(() => category.$all);

watch(search, async () => {
  loadingSearch.value = true;
  try {
    setTimeout(async () => {
      await category.index(search.value);
    }, 700);
  } finally {
    loadingSearch.value = false;
  }
});

onMounted(async () => {
  await category.index("");
});

watch(
  () => showForm.value,
  (newValue) => {
    if (!newValue) {
      selected.value = undefined;
    }
  }
);

const handleEdit = async (item: CategoryProps) => {
  selected.value = item;
  showForm.value = true;
};

// const handleCloseForm = async () => {
//   showForm.value = false;
//   selected.value = undefined;
// };
</script>
