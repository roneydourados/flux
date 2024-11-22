<template>
  <div>
    <v-row dense>
      <v-col cols="12" lg="6">
        <DashboardTransactionCard />
      </v-col>
      <v-col cols="12" lg="6">
        <DashboardServiceCard />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="4">
        <DashboardCardInvestment />
      </v-col>
      <v-col cols="12" lg="4">
        <DashboardCardResale />
      </v-col>
      <v-col cols="12" lg="4">
        <DashboardCardExpense />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts"></script>
