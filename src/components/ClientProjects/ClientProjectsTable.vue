<template>
  <Table
    title="Projetos"
    :headers="headers"
    :items="$projects"
    @add="handleNew"
    @search="handleSearch($event)"
    :show-crud="false"
  >
    <template v-slot:item.name="{ item }">
      <div class="d-flex align-center" style="gap: 1rem">
        <v-icon icon="mdi-file-tree-outline" :color="item.color" />
        <span>{{ item.name }}</span>
      </div>
    </template>
    <template v-slot:item.client="{ item }">
      <div class="d-flex">
        <v-icon icon="mdi-account-outline" color="primary" start />
        <span>{{ item.Client.name }}</span>
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        color="orange"
        variant="text"
        size="small"
        @click="handleEdit(item)"
      >
        <v-icon icon="mdi-pencil-outline" size="20"></v-icon>
        <v-tooltip
          activator="parent"
          location="top center"
          content-class="tooltip-background"
        >
          Editar
        </v-tooltip>
      </v-btn>
      <v-btn
        icon
        color="error"
        variant="text"
        size="small"
        @click="getItemDestroy(item)"
      >
        <v-icon icon="mdi-delete-outline" size="20"></v-icon>
        <v-tooltip
          activator="parent"
          location="top center"
          content-class="tooltip-background"
        >
          Apagar
        </v-tooltip>
      </v-btn>
    </template>
  </Table>

  <DialogForm
    :show="dialogForm"
    title="Projeto"
    @dialog="dialogForm = false"
    width="500"
  >
    <FormCrud :on-submit="onSubmit">
      <StringInput label="Nome" v-model="model.name" required />
      <strong style="font-size: 1rem">Cor:</strong>
      <v-color-picker
        v-model="model.color"
        width="100%"
        hide-canvas
        hide-inputs
        show-swatches
        elevation="0"
      />
    </FormCrud>
  </DialogForm>
  <Dialog
    title="Apagar ?"
    :dialog="showDestroy"
    show-cancel
    @confirm="handleDestroy"
    @cancel="showDestroy = false"
  >
    <strong>
      {{ model.name }}
    </strong>
  </Dialog>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import { type ClientProps } from "@/interfaces/Client";
import { type ClientProjectProps } from "@/interfaces/ClientProjects";

const props = defineProps({
  width: {
    type: String,
    default: "80%",
  },
  loadOnInit: {
    type: Boolean,
    default: true,
  },
  client: {
    type: Object as PropType<ClientProps>,
    default: () => ({}),
  },
});

defineEmits(["close"]);

const projectStore = useProjectsStore();
const loading = ref(false);
const dialogForm = ref(false);
const isEditing = ref(false);
const showDestroy = ref(false);
const headers = [
  {
    title: "Nome do projeto",
    key: "name",
  },
  {
    title: "Ações",
    key: "actions",
  },
];
const model = ref<ClientProjectProps>({
  id: 0,
  name: "",
  clientId: 0,
  color: "",
  Client: undefined,
});

const $projects = computed(() => projectStore.$all);
const $single = computed(() => projectStore.$single);

watchEffect(() => {
  if (props.client.id) {
    model.value.clientId = props.client.id;
    model.value.Client = props.client;
  }
});

onMounted(async () => {
  if (props.loadOnInit) {
    loading.value = true;
    try {
      await getProjects();
    } finally {
      loading.value = false;
    }
  }
});

const clearModel = () => {
  model.value = {
    id: 0,
    name: "",
    clientId: 0,
    color: "",
    Client: undefined,
  };
};

const getProjects = async (query: string = "") => {
  await projectStore.index(query, props.client.id);
};

const handleNew = () => {
  clearModel();
  dialogForm.value = true;
  isEditing.value = false;
};

const handleEdit = async (item: ClientProjectProps) => {
  loading.value = true;
  try {
    await projectStore.show(item.id!);

    model.value = {
      id: $single.value?.id ?? 0,
      clientId: $single.value?.clientId ?? 0,
      name: $single.value?.name ?? "",
      Client: $single.value?.Client,
      color: $single.value?.color ?? "#000000",
    };

    dialogForm.value = true;
    isEditing.value = true;
  } finally {
    loading.value = false;
  }
};

const onSubmit = async () => {
  dialogForm.value = false;

  loading.value = true;
  try {
    try {
      if (isEditing.value) {
        await projectStore.update({
          id: model.value.id,
          name: model.value.name,
          clientId: model.value.Client?.id!,
          color: model.value.color ?? "#000000",
        });
      } else {
        await projectStore.store({
          name: model.value.name,
          clientId: model.value.Client?.id!,
          color: model.value.color ?? "#000000",
        });
      }
      clearModel();
      await getProjects();
    } catch (error) {
      console.error("🚀 ~ onSubmit ~ error:", error);
    }
  } finally {
    loading.value = false;
  }
};

const getItemDestroy = (item: ClientProjectProps) => {
  model.value = item;
  showDestroy.value = true;
};

const handleDestroy = async () => {
  showDestroy.value = false;
  loading.value = true;
  try {
    try {
      await projectStore.destroy(model.value.id!);
      await getProjects();
      clearModel();
    } catch (error) {
      console.error("🚀 ~ handleDestroy ~ error:", error);
    }
  } finally {
    loading.value = false;
  }
};

const handleSearch = async (search: string) => {
  setTimeout(async () => {
    loading.value = true;
    try {
      await getProjects(search);
    } finally {
      loading.value = false;
    }
  }, 1000);
};
</script>
