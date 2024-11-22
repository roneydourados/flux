<template>
  <svg
    :height="height"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="36"
      height="36"
      rx="8.53333"
      fill="#55B02E"
      fill-opacity="0.08"
    />
    <path
      d="M24.6663 14.6667L18.9997 20.3334L15.6663 17.0001L11.333 21.3334"
      stroke="#55B02E"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20.667 14.6667H24.667V18.6667"
      stroke="#55B02E"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  height: {
    type: String,
    default: "120",
  },
  color: {
    type: String,
    default: "#55B02E",
  },
});
</script>

<style scoped></style>
