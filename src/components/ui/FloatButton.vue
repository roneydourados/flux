<template>
  <div>
    <v-fab
      :app="true"
      :color="color"
      location="right bottom"
      :size="size"
      icon
      @click="$emit('click')"
    >
      <v-icon :icon="icon" :size="iconSize" />
    </v-fab>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: "mdi-plus",
  },
  size: {
    type: String,
    default: "60",
  },
  iconSize: {
    type: String,
    default: "30",
  },
  color: {
    type: String,
    default: "success",
  },
});
</script>
