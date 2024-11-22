<template>
  <div>
    <Card>
      <template #title>
        <div class="d-flex align-center" style="gap: 0.5rem">
          <TransactionInvestmentSVG height="30" />
          <span> Investimento </span>
        </div>
      </template>
      <template #content>
        <v-row dense>
          <v-col cols="12">
            <h2 style="font-weight: 400">R$ 2500,00</h2>
          </v-col>
        </v-row>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts"></script>
