<template>
  <div>
    <v-navigation-drawer
      color="surface"
      v-model="drawer"
      location="right"
      temporary
      persistent
      :mobile="mobile"
      :width="width"
      @update:model-value="($event) => $emit('update:drawer', $event)"
    >
      <div class="pa-6">
        <div class="d-flex align-center justify-space-between w-100">
          <h4>{{ title }}</h4>
          <v-btn variant="text" icon="mdi-close" @click="drawer = false" />
        </div>
        <slot />
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

defineProps({
  title: {
    type: String,
    default: "Formulário",
  },
  width: {
    type: String,
    default: "600",
  },
});

defineEmits(["update:drawer"]);

const drawer = defineModel("drawer", {
  default: false,
});
</script>
