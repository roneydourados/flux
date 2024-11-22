<template>
  <v-btn
    :color="color"
    :variant="variant"
    :block="block"
    :rounded="rounded"
    :size="size"
    :disabled="disabled || loading"
    :loading="loading"
    class="text-none"
    @click="$emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
type VariantType =
  | "flat"
  | "text"
  | "elevated"
  | "tonal"
  | "outlined"
  | "plain"
  | undefined;

defineProps({
  block: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "grey",
  },
  variant: {
    type: String as PropType<VariantType>,
    default: "flat",
  },
  rounded: {
    type: String,
    default: "xl",
  },
  size: {
    type: String,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["click"]);
</script>
