<template>
  <svg
    :height="height"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 4.50016H15M13.6667 4.50016V13.8335C13.6667 14.5002 13 15.1668 12.3333 15.1668H5.66667C5 15.1668 4.33333 14.5002 4.33333 13.8335V4.50016M6.33333 4.50016V3.16683C6.33333 2.50016 7 1.8335 7.66667 1.8335H10.3333C11 1.8335 11.6667 2.50016 11.6667 3.16683V4.50016M7.66667 7.8335V11.8335M10.3333 7.8335V11.8335"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  height: {
    type: String,
    default: "17",
  },
  color: {
    type: String,
    default: "#71717A",
  },
});
</script>
