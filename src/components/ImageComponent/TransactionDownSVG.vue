<template>
  <svg
    :height="height"
    viewBox="0 0 37 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      width="36"
      height="36"
      rx="8.53333"
      fill="#F6352E"
      fill-opacity="0.08"
    />
    <path
      d="M25.1663 21.3334L19.4997 15.6667L16.1663 19.0001L11.833 14.6667"
      stroke="#E93030"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M21.167 21.3333H25.167V17.3333"
      stroke="#E93030"
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
