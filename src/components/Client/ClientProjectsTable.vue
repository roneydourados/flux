<template>
  <Table
    title="Projetos"
    :headers="headers"
    :items="$projects"
    @search="handleSearch($event)"
    :show-crud="false"
  >
    <template #title-button>
      <v-btn
        variant="flat"
        color="green"
        class="text-none"
        size="small"
        @click="handleNew"
      >
        <v-icon icon="mdi-plus"> </v-icon>
        Adicionar projeto
      </v-btn>
    </template>
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
      <v-btn icon variant="text" size="small" @click="handleEdit(item)">
        <EditSVG />
      </v-btn>
      <v-btn icon variant="text" size="small" @click="getItemDestroy(item)">
        <DeleteSVG />
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
  <DialogQuestion
    title="Apagar ?"
    v-model="showDestroy"
    show-cancel
    @confirm="handleDestroy"
    @cancel="showDestroy = false"
  >
    <strong>
      {{ model.name }}
    </strong>
  </DialogQuestion>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import { type ClientProjectProps } from "@/interfaces/ClientProjects";

defineProps({
  width: {
    type: String,
    default: "80%",
  },
});

defineEmits(["close"]);
const { $toast } = useNuxtApp();
const projectStore = useProjectsStore();
const clientStore = useClientStore();

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
const loading = ref(false);
const dialogForm = ref(false);
const isEditing = ref(false);
const showDestroy = ref(false);
const model = ref({
  name: "",
  color: "",
  publicId: "",
});

const $projects = computed(() => projectStore.$all);
const $single = computed(() => projectStore.$single);
const $client = computed(() => clientStore.$single);

const clearModel = () => {
  model.value = {
    name: "",
    color: "",
    publicId: "",
  };
};

const getProjects = async (query: string = "") => {
  loading.value = true;
  try {
    await projectStore.index(query, $client.value?.id);
  } finally {
    loading.value = false;
  }
};

const handleNew = () => {
  if (!$client.value?.id) {
    $toast.warn("Cadastre um cliente para adicionar um projeto");
    return;
  }

  clearModel();
  dialogForm.value = true;
  isEditing.value = false;
};

const handleEdit = async (item: ClientProjectProps) => {
  loading.value = true;
  try {
    await projectStore.show(item.publicId!);

    if (!$single.value) {
      $toast.error("Projeto não encontrado");
      return;
    }

    model.value = {
      name: $single.value.name ?? "",
      color: $single.value.color ?? "#1565C0",
      publicId: $single.value.publicId!,
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
    if (isEditing.value) {
      await projectStore.update({
        publicId: model.value.publicId,
        name: model.value.name,
        color: model.value.color ?? "#1565C0",
      });
    } else {
      await projectStore.store({
        name: model.value.name,
        clientId: $client.value?.id,
        color: model.value.color ?? "#1565C0",
      });
    }
    await getProjects();
    clearModel();
  } catch (error) {
    console.error("🚀 ~ onSubmit ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const getItemDestroy = (item: ClientProjectProps) => {
  model.value = {
    name: item.name,
    publicId: item.publicId!,
    color: item.color,
  };

  showDestroy.value = true;
};

const handleDestroy = async () => {
  showDestroy.value = false;
  loading.value = true;
  try {
    await projectStore.destroy(model.value.publicId!);
    await getProjects();
    clearModel();
  } catch (error) {
    console.error("🚀 ~ handleDestroy ~ error:", error);
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
