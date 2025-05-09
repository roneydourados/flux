<template>
  <div class="w-100">
    <v-row>
      <v-col cols="12">
        <TransactionsHeader title="Novembro" />
      </v-col>
      <v-col cols="12">
        <TransactionsTable />
      </v-col>
    </v-row>
    <FloatButton v-if="!showForm" size="50" @click="showForm = true" />
    <TransactionForm v-model="showForm" />
  </div>
</template>

<script setup lang="ts">
const showForm = ref(false);
</script>
