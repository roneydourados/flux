<template>
  <div>
    <SelectInput
      v-model="model"
      label="Forma pagamento"
      :items="paymentForms"
      item-value="type"
      item-title="name"
      density="comfortable"
      :required="required"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  required: {
    type: Boolean,
    default: false,
  },
});
const model = defineModel({
  default: "",
});
</script>
