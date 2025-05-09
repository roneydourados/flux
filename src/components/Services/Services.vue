<template>
  <div class="w-100">
    <v-row>
      <v-col cols="12">
        <ServiceHeader />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ServiceTable />
      </v-col>
    </v-row>
    <FloatButton v-if="!showForm" size="50" @click="showForm = true" />
    <ServiceForm v-model="showForm" />
  </div>
</template>

<script setup lang="ts">
const showForm = ref(false);
</script>
