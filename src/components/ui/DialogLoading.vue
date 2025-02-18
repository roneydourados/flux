<template>
  <v-dialog :model-value="dialog" persistent :width="mobile ? '100%' : '20%'">
    <v-card rounded="xl">
      <div class="d-flex flex-column align-center w-100 pa-8" style="gap: 1rem">
        <AnimedSvg height="80" />
        <Logo height="65" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
});

const { mobile } = useDisplay();
</script>
