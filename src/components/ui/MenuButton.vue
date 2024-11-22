<template>
  <div>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          :variant="variant"
          :color="color"
          :disabled="disabled"
          v-bind="props"
          :size="size"
          rounded="xl"
          class="text-none"
          :block="block"
        >
          <slot />
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="$emit('click', item.title)"
        >
          <template v-if="item.icon" #prepend>
            <v-icon :icon="item.icon" :color="item.iconColor" size="20" />
          </template>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { type MenuButtonProps } from "@/interfaces/MenuButton";
type VariantProps =
  | "flat"
  | "text"
  | "elevated"
  | "tonal"
  | "outlined"
  | "plain"
  | undefined;

defineProps({
  items: {
    type: Array as PropType<MenuButtonProps[]>,
    required: true,
  },
  size: {
    type: String,
    default: undefined,
  },
  variant: {
    type: String as PropType<VariantProps>,
    default: "flat",
  },
  color: {
    type: String,
    default: "surface",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>
