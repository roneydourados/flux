<template>
  <v-card class="w-100 px-4" color="#141414">
    <v-card-title>Dados do cliente</v-card-title>
    <v-card-text>
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
            <ClientForm />
          </div>
          <div v-if="tabItem.id === 2" class="py-4">
            <ClientProjectsTable />
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const tab = ref(1);
const menuItens = computed(() => {
  return [
    { title: "Dados", icon: "mdi-account-outline", id: 1 },
    { title: "Projetos", icon: "mdi-set-left", id: 2 },
  ];
});
</script>
