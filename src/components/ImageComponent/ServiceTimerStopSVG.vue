<template>
  <svg xmlns="http://www.w3.org/2000/svg" :height="height" viewBox="0 0 24 24">
    <rect
      width="14"
      height="14"
      x="5"
      y="5"
      fill="none"
      stroke="#71717A"
      stroke-linecap="round"
      stroke-linejoin="round"
      rx="2"
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
