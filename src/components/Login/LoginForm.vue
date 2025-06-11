<template>
  <div class="w-100">
    <v-row class="layout-row">
      <v-col cols="12" lg="4" class="d-flex align-center px-8">
        <div
          class="content-container d-flex flex-column align-center text-center w-100"
        >
          <div class="d-flex flex-column align-center">
            <Logo height="70" />
            <h1>Bem vindo</h1>
          </div>

          <p>
            Controle total das suas finanças, sem complicação. Transforme a
            maneira como você gerencia seu dinheiro com o Timer Count.
          </p>
          <a
            href="/api/auth/google"
            class="w-100"
            style="text-decoration: none"
          >
            <Button
              color="surface"
              rounded="lg"
              block
              class="text-none mt-4"
              size="45"
            >
              <v-img
                src="@/assets/images/google.svg"
                cover
                alt="Timer Count controle financeiro pessoal e de serviços"
                height="25"
                width="25"
                class="mr-2"
              />
              Entrar com google
            </Button>
          </a>
        </div>
      </v-col>
      <v-col v-if="!mobile" cols="12" lg="8">
        <v-img
          src="@/assets/images/login-image.png"
          cover
          alt="Timer Count controle financeiro pessoal"
          max-height="100dvh"
          style="object-fit: cover"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
</script>

<style scoped>
.layout-row {
  height: 100dvh;
  overflow: hidden;
}

.layout-row > .v-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; /* Centraliza o texto */
}

.layout-row .v-img {
  max-height: 100dvh;
  width: 100%;
  object-fit: cover;
}
</style>
