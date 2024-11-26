<template>
  <v-dialog
    persistent
    transition="dialog-top-transition"
    :model-value="show"
    :width="mobile ? '' : '600'"
  >
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-subtitle-2 text-md-body-2 text-lg-h6">Ícones</div>
        <div>
          <v-btn
            variant="text"
            icon="mdi-close"
            @click="$emit('close')"
            class="ml-4"
          />
        </div>
      </v-card-title>

      <v-card-text class="pa-4">
        <div
          class="d-flex justify-center w-100"
          style="overflow-x: hidden; overflow-y: scroll; height: 30rem"
        >
          <v-row>
            <v-col
              v-for="item in materialIconList"
              :key="item.name"
              cols="3"
              md="1"
              lg="2"
            >
              <v-btn
                :icon="item.name"
                variant="tonal"
                @click="selectIcon(item.name)"
              >
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const emit = defineEmits(["close"]);

const icon = defineModel({
  default: "",
});

const show = defineModel("show", {
  default: false,
});

const selectIcon = (iconSelected: string) => {
  icon.value = iconSelected;
  show.value = false;
};
</script>
