<template>
  <div>
    <SelectInput
      v-model="model"
      :label="label"
      :items="paymentForms"
      item-value="type"
      item-title="name"
      density="comfortable"
      :required="required"
      :placeholder="label"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Forma de pagamento",
  },
});
const model = defineModel({
  default: "",
});
</script>
