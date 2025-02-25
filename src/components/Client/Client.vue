<template>
  <div class="w-100">
    <ClientTable />
  </div>
  <!-- <DialogForm
    :show="show"
    title="Cliente"
    @dialog="close"
    :width="mobile ? '100%' : '60%'"
  >
    <v-tabs v-model="tab" color="green">
      <v-tab
        v-for="item in menuItens"
        :key="item.id"
        :value="item.id"
        class="text-none"
      >
        <v-icon :icon="item.icon" start />
        <span v-if="!mobile">
          {{ item.title }}
        </span>
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="tabItem in menuItens"
        :key="tabItem.id"
        :value="tabItem.id"
      >
        <div v-if="tabItem.id === 1" class="py-4">
          <ClientForm :client="client" />
        </div>
        <div v-if="tabItem.id === 2" class="py-4">
          <ClientProjectsTable />
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </DialogForm> -->
</template>

<script setup lang="ts">
import { type ClientProps } from "@/interfaces/Client";
import { useDisplay } from "vuetify";

/*const props = */ defineProps({
  client: {
    type: Object as PropType<ClientProps>,
    default: () => ({} as ClientProps),
  },
});

// const projects = useProjectsStore();
const tab = ref(1);
const menuItens = computed(() => {
  return [
    { title: "Dados", icon: "mdi-account-outline", id: 1 },
    { title: "Projetos", icon: "mdi-set-left", id: 2 },
  ];
});

const emit = defineEmits(["close"]);
const { mobile } = useDisplay();

const show = defineModel({
  default: false,
});

watchEffect(() => {
  if (show.value) {
    tab.value = 1;
  }
});

const close = () => {
  show.value = false;
};
</script>
