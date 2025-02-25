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
      clearable
      :disabled="disabled"
    >
      <template #items="{ item, props }">
        <v-list-item
          v-bind="props"
          :title="item.raw.name"
          :subtitle="item.raw.email"
          density="compact"
        />
      </template>

      <template #selection="{ item }">
        <div class="d-flex align-center">
          <span class="d-inline-block text-truncate" style="width: 100%">
            {{ item.raw.name }}
          </span>
        </div>
      </template>
    </AutoCompleteInput>
  </div>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: "",
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

const clientStore = useClientStore();

// Define o modelo para o v-model
const value = defineModel<ClientProps>();
const search = ref("");
const loadingSearch = ref(false);
const clients = computed(() => clientStore.$all);

watch(search, async () => {
  setTimeout(async () => {
    loadingSearch.value = true;
    try {
      await clientStore.index(search.value);
    } finally {
      loadingSearch.value = false;
    }
  }, 700);
});
</script>
