<template>
  <v-app>
    <v-app-bar color="background" elevation="">
      <template #title>
        <Logo height="30" />
      </template>

      <v-app-bar-nav-icon
        v-if="mobile"
        variant="text"
        color="white"
        @click.stop="drawer = !drawer"
      />

      <v-spacer v-if="!mobile" />

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
                    @click="route.push('/signature')"
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

    <LayoutDrawer
      v-model="drawer"
      :mobile="mobile"
      @update:drawer="drawer = $event"
    />

    <v-main class="d-flex align-center justify-center full-height">
      <div class="w-100 pa-4 full-height no-scroll">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const { user, clear } = useUserSession();
const { api } = useAxios();
const route = useRouter();

const drawer = ref(true);

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

<style scoped>
.full-height {
  height: 100%; /* Ocupa toda a altura da viewport */
}
</style>
