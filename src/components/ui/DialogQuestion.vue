<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-chat-question-outline"
      :text="text"
      rounded="lg"
      color="darkgreen"
    >
      <template #title>
        <span style="font-size: 1.1rem">{{ title }}</span>
      </template>
      <template #text>
        <span style="color: #b8b8b8; font-size: 0.9rem">{{ text }}</span>
      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-row dense justify="end" class="pa-2">
          <v-col cols="6">
            <v-btn
              @click="handleCancel"
              class="text-none"
              variant="flat"
              rounded="lg"
              :color="colorCancel"
              block
            >
              <span style="font-size: 0.8rem">
                {{ textCancel }}
              </span>
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn
              @click="handleConfirm"
              class="text-none"
              variant="flat"
              rounded="lg"
              :color="colorConfirm"
              block
            >
              <span style="font-size: 0.8rem">
                {{ textConfirm }}
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  colorConfirm: {
    type: String,
    default: "green",
  },
  colorCancel: {
    type: String,
    default: "surface",
  },
  textConfirm: {
    type: String,
    default: "Confirmar",
  },
  textCancel: {
    type: String,
    default: "Cancelar",
  },
});
const emit = defineEmits(["cancel", "confirm"]);
const dialog = defineModel({
  default: false,
});

const handleConfirm = () => {
  emit("confirm");
  dialog.value = false;
};

const handleCancel = () => {
  emit("cancel");
  dialog.value = false;
};
</script>
