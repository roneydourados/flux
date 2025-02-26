<template>
  <div class="w-100">
    <!-- <pre>{{ $dashboard }}</pre> -->
    <v-row>
      <v-col cols="12">
        <DashboardHeader title="Dashboard" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="8">
        <v-row dense>
          <v-col cols="12">
            <DashboardCards />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="4">
            <DashboardChartTransaction />
          </v-col>
          <v-col cols="12" lg="4">
            <DashboardTransactionCategory />
          </v-col>
          <v-col cols="12" lg="4">
            <DashboardServiceClient />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
        <DashboardLastTransactions @transactions="$emit('transactions')" />
        <DashboardLastServices @services="$emit('services')" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const dashboard = useDashboardStore();

const $dashboard = computed(() => dashboard.$dashboard);
</script>
