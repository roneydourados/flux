<template>
  <div class="d-flex flex-wrap align-center w-100" style="gap: 1rem">
    <AutoCompleteInput
      v-model="value"
      v-model:search="search"
      item-title="name"
      label="Cliente"
      placeholder="Digite nome..."
      return-object
      :required="required"
      icon="mdi-magnify"
      :items="clients"
      :loading="loadingSearch"
      @click="search = ''"
      @update:model-value="$emit('update:modelValue', $event)"
      clearable
      :disabled="disabled"
    >
      <template #items="{ item, props }">
        <v-list-item v-bind="props" :title="item.raw.name" density="compact">
        </v-list-item>
      </template>

      <template #selection="{ item }">
        <div class="d-flex align-center">
          <span class="d-inline-block text-truncate" style="width: 100%">
            {{ item.raw.name }}
          </span>
        </div>
      </template>
    </AutoCompleteInput>
    <div class="mt-n6">
      <v-tooltip text="Novo cliente" content-class="tooltip-background">
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
    <ClientForm v-model="showForm" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Object,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const clientStore = useClientStore();

const search = ref("");
const loadingSearch = ref(false);
const showForm = ref(false);
const value = props.modelValue;

const clients = computed(() => clientStore.$all);

watch(search, async () => {
  setTimeout(async () => {
    loadingSearch.value = true;
    try {
      await clientStore.index(search.value);
      // const config = {
      //   params: {
      //     name: search.value,
      //   },
      // };

      // const resp = await api.get("/clients/index", config);

      // clients.value = resp.data;
    } finally {
      loadingSearch.value = false;
    }
  }, 700);
});
</script>
