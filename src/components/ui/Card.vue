<template>
  <div>
    <v-sheet border="md" rounded="lg">
      <v-card
        rounded="lg"
        color="background"
        flat
        :min-height="minHeight"
        :height="height"
      >
        <slot />
        <v-card-title>
          <div class="d-flex align-center" style="gap: 0.5rem">
            <slot name="title" />
          </div>
        </v-card-title>
        <v-card-text class="pa-6">
          <slot name="content" />
        </v-card-text>
      </v-card>
    </v-sheet>
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
