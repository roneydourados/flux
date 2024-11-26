<template>
  <v-dialog
    persistent
    transition="dialog-top-transition"
    :model-value="show"
    :width="mobile ? '' : '600'"
  >
    <v-card rounded="xl" class="pa-4">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-subtitle-2 text-md-body-2 text-lg-h6">Categoria</div>
        <div>
          <v-btn variant="tonal" @click="showIconList = true">
            <IconList v-model="model.icon" v-model:show="showIconList" />
            <v-icon :icon="model.icon ? model.icon : 'mdi-shape-circle-plus'" />
            <v-tooltip activator="parent" location="start">
              Selecionar ícone
            </v-tooltip>
          </v-btn>
          <v-btn
            variant="text"
            icon="mdi-close"
            @click="show = false"
            class="ml-4"
          />
        </div>
      </v-card-title>
      <v-card-text>
        <FormCrud :on-submit="handleSubmit" :show-submit-button="true">
          <v-row dense>
            <v-col cols="12">
              <StringInput v-model="model.categoryName" label="Nome" required />
            </v-col>
          </v-row>
        </FormCrud>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
  data: {
    type: Object as PropType<CategoryProps>,
    default: {},
  },
});
const { mobile } = useDisplay();
const category = useCategoryStore();
const showIconList = ref(false);

const show = defineModel({
  default: false,
});

const model = ref({
  categoryName: "",
  icon: "",
});

watch(
  () => show.value,
  (newValue) => {
    if (newValue) {
      loadModel();
    } else {
      clearModel();
    }
  }
);

const loadModel = () => {
  if (props.data.publicId) {
    model.value = {
      categoryName: props.data.categoryName!,
      icon: props.data.icon!,
    };
  }
};

const clearModel = () => {
  model.value = {
    categoryName: "",
    icon: "",
  };
};

const handleSubmit = async () => {
  show.value = false;
  try {
    if (props.data && props.data.publicId) {
      await category.update({
        ...model.value,
        publicId: props.data.publicId,
      });
    } else {
      await category.create(model.value);
    }
    await category.index("");
    clearModel();
  } catch (error) {
    console.log("🚀 ~ handleSubmit ~ error:", error);
    clearModel();
  }
};
</script>
