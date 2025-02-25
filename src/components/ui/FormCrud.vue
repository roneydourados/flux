<template>
  <div class="w-100">
    <form ref="formRef" @submit.prevent="onSubmit">
      <slot />
      <div
        class="d-flex align-center pa-4 w-100"
        v-if="showSubmitButton"
        style="gap: 0.5rem"
      >
        <v-spacer></v-spacer>
        <slot name="button" />
        <Button
          color="green"
          :disabled="loading"
          :loading="loading"
          @click="onSubmit"
        >
          <div v-if="!loading" class="d-flex align-center">
            <v-icon icon="mdi-check" />
            <span style="font-size: 0.9rem" class="ml-2">
              {{ buttonLabel }}
            </span>
          </div>
        </Button>
      </div>
      <DialogLoading :dialog="loading" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";

const props = defineProps({
  onSubmit: {
    type: Function,
    required: true,
  },
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  buttonLabel: {
    type: String,
    default: "Salvar",
  },
  resetForm: {
    type: Boolean,
    default: true,
  },
});

const formRef = ref();
const loading = ref(false);
const { handleSubmit, handleReset } = useForm();

const onSubmit = handleSubmit(async () => {
  loading.value = true;
  try {
    await props.onSubmit();
    if (props.resetForm) {
      handleReset();
    }
  } finally {
    loading.value = false;
  }
});
</script>
