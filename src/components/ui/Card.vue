<template>
  <div>
    <v-card
      variant="outlined"
      class="custom-border"
      rounded="lg"
      :height="height"
    >
      <v-card-text>
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps({
  minHeight: {
    type: String,
    default: "auto",
  },
  height: {
    type: String,
    default: undefined,
  },
});
</script>

<style scoped>
.custom-border {
  border-color: #1f1f21; /* Custom border color */
}
</style>
