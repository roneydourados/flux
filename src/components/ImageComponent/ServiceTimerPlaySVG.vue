<template>
  <svg xmlns="http://www.w3.org/2000/svg" :height="height" viewBox="0 0 24 24">
    <path
      fill="#71717A"
      d="M9 17.192V6.808L17.154 12zm1-1.842L15.289 12L10 8.65z"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  height: {
    type: String,
    default: "120",
  },
});
</script>
