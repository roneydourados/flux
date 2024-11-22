<template>
  <div>
    <v-app-bar color="darkgreen" flat elevation="0">
      <v-app-bar-title>
        <div class="d-flex flex-column">
          <div class="d-flex align-center" style="gap: 2rem">
            <Logo height="40" />

            <!-- <Logo v-else height="30" /> -->
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
          </div>
        </div>
      </v-app-bar-title>
      <template v-slot:append>
        <div
          :class="
            mobile ? 'd-flex align-center px-2' : 'px-8 d-flex align-center'
          "
          style="gap: 1rem"
        >
          <v-menu rounded>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" color="darkgreen">
                <v-avatar>
                  <v-img :alt="user?.name" :src="user?.urlFoto" />
                </v-avatar>
              </v-btn>
            </template>
            <v-card min-width="200" color="surface">
              <v-card-text>
                <div class="mx-auto text-center">
                  <v-avatar>
                    <v-img :alt="user?.name" :src="user?.urlFoto" />
                  </v-avatar>
                  <h3 class="mt-2">{{ user?.name }}</h3>
                  <p class="text-caption text-grey-lighten-1 mt-1">
                    {{ user?.email }}
                  </p>
                  <v-divider class="my-3"></v-divider>
                  <v-btn
                    block
                    class="text-none"
                    variant="text"
                    @click="handleLogout"
                  >
                    <v-icon class="mr-2">mdi-logout</v-icon>
                    Sair
                  </v-btn>
                  <v-btn
                    block
                    class="text-none"
                    variant="text"
                    @click="tab = 4"
                  >
                    <v-icon class="mr-2" icon="mdi-account-wrench-outline" />
                    Assinatura
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
      </template>
    </v-app-bar>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="tabItem in menuItens"
        :key="tabItem.id"
        :value="tabItem.id"
      >
        <Dashboard
          v-if="tabItem.id === 1"
          @transactions="tab = 2"
          @services="tab = 3"
        />
        <div v-if="tabItem.id === 2"><Transactions /></div>
        <div v-if="tabItem.id === 3"><Services /></div>
        <div v-if="tabItem.id === 4"><Signature /></div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const route = useRouter();
const { user, clear } = useUserSession();
const { api } = useAxios();
const { mobile } = useDisplay();

const menuItens = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard", id: 1 },
  { title: "Financeiro", icon: "mdi-cash", id: 2 },
  { title: "Serviços", icon: "mdi-account-wrench-outline", id: 3 },
  { title: "Assinatura", icon: "mdi-vector-arrange-below", id: 4 },
]);

const tab = ref(1);

const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
    await clear();
    await route.push("/");
  } catch (error) {
    console.error(error);
  }
};
</script>
