<template>
  <v-app class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center full-height">
      <div class="w-100 pa-4 full-height no-scroll">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts"></script>

<style scoped>
.full-height {
  height: 100%; /* Ocupa toda a altura da viewport */
}
</style>
