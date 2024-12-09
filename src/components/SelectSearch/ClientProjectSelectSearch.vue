<template>
  <AutoCompleteInput
    v-model="value"
    v-model:search="search"
    item-title="name"
    label="Projeto"
    placeholder="Digite nome..."
    return-object
    :required="required"
    icon="mdi-magnify"
    :items="projects"
    :loading="loadingSearch"
    @click="search = ''"
    @update:model-value="$emit('update:modelValue', $event)"
    :clearable="cleareable"
    :disabled="disabled"
  >
    <template #items="{ item, props }">
      <v-list-item
        v-bind="props"
        :title="item.raw.name"
        :subtitle="`Cliente: ${item.raw.Client.name}`"
        density="compact"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-file-tree-outline" :color="item.raw.color" />
        </template>
      </v-list-item>
    </template>

    <template #selection="{ item }">
      <div class="d-flex align-center">
        <v-icon icon="mdi-file-tree-outline" :color="item.raw.color" />
        <span class="ml-2 d-inline-block text-truncate" style="width: 95%">
          {{ item.raw.name }}
        </span>
      </div>
    </template>
  </AutoCompleteInput>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  // modelValue: {
  //   type: Object,
  //   default: undefined,
  // },
  cleareable: {
    type: Boolean,
    default: false,
  },
  required: {
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
});

const emit = defineEmits(["update:modelValue"]);

const projectStore = useProjectsStore();

const search = ref("");
const loadingSearch = ref(false);

const value = defineModel<ClientProjectProps>({
  default: undefined,
});

const projects = computed(() => projectStore.$all);

watch(search, async () => {
  setTimeout(async () => {
    loadingSearch.value = true;
    try {
      if (props.clientId > 0) {
        await projectStore.index(search.value, props.clientId);
      } else {
        await projectStore.index(search.value);
      }
    } finally {
      loadingSearch.value = false;
    }
  }, 700);
});
</script>
