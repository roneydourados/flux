<template>
  <svg
    :height="height"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 2.5H14V6.5"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.66699 9.83333L14.0003 2.5"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 9.16667V13.1667C12 13.5203 11.8595 13.8594 11.6095 14.1095C11.3594 14.3595 11.0203 14.5 10.6667 14.5H3.33333C2.97971 14.5 2.64057 14.3595 2.39052 14.1095C2.14048 13.8594 2 13.5203 2 13.1667V5.83333C2 5.47971 2.14048 5.14057 2.39052 4.89052C2.64057 4.64048 2.97971 4.5 3.33333 4.5H7.33333"
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
