<template>
  <v-navigation-drawer
    v-model="drawer"
    color="background"
    elevation="4"
    width="250"
  >
    <!-- <template v-slot:prepend>
      <v-list-item lines="tw</v-navigation-drawer>o">
        <template #prepend>
          <v-avatar color="primary">
            <span class="text-h6">{{ $user?.initials }}</span>
          </v-avatar>
        </template>
        <template #title>
          <span>{{ $user?.name }}</span>
        </template>
        <template #subtitle>
          <span style="font-size: 0.8rem">
            {{ $user?.Profile?.profileName }}
          </span>
        </template>
      </v-list-item>
    </template> -->

    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, index) in itemsMenu"
        :key="index"
        :prepend-icon="item.icon"
        :value="item.to"
        :to="item.to"
        active-class="item-menu"
      >
        <template #title>
          <span style="font-size: 0.8rem; font-weight: 400">
            {{ item.title }}
          </span>
        </template>
      </v-list-item>
    </v-list>

    <!-- <template v-slot:append>
      <v-divider />

      <div class="pa-2">
        <v-btn
          color="green"
          class="text-none mb-12"
          variant="flat"
          block
          @click="logout"
        >
          Sair
        </v-btn>
      </div>
    </template> -->
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { getInitials } = useUtils();
const { mobile } = useDisplay();

const route = useRouter();

const emit = defineEmits(["update:drawer"]);

const drawer = defineModel({
  default: true,
});

const itemsMenu = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    id: 1,
    to: "/dashboard",
  },
  {
    title: "Clientes",
    icon: "mdi-account-multiple-outline",
    id: 2,
    to: "/clients",
  },
  {
    title: "Financeiro",
    icon: "mdi-cash",
    id: 3,
    to: "/finance",
  },
  {
    title: "Serviços",
    icon: "mdi-account-wrench-outline",
    id: 5,
    to: "/services",
  },
  {
    title: "Assinatura",
    icon: "mdi-vector-arrange-below",
    id: 6,
    to: "/signature",
  },
]);

const logout = () => {
  route.push("/");
};
</script>

<style scoped>
.item-menu {
  background-color: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-itemMenu)) !important;
}

.navigation-drawer-border {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
