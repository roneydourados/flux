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
      fill="white"
      fill-opacity="0.08"
    />
    <path
      d="M22.6663 13.3333C21.6663 13.3333 20.7997 14.2666 20.6663 14.6666C18.333 13.6666 13.333 14.4666 13.333 17.9999C13.333 19.1999 13.333 19.9999 14.6663 20.9999V23.3333H17.333V21.9999H19.333V23.3333H21.9997V20.6666C22.6663 20.3333 23.133 19.9999 23.333 19.3333H24.6663V16.6666H23.333C23.333 15.9999 22.9997 15.6666 22.6663 15.3333V13.3333Z"
      stroke="white"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.333 16V16.6667C11.333 17.4 11.933 18 12.6663 18H13.333"
      stroke="white"
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
