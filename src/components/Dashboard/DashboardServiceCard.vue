<template>
  <div>
    <v-card rounded="lg" color="darkgreen">
      <v-card-title>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center" style="gap: 0.5rem">
            <ServiceSVG height="20" />
            <span> Total serviços </span>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="pa-6">
        <v-row dense>
          <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 1rem">
            <h2 style="font-weight: 400">
              {{ amountFormated($total ?? 0, true) }}
            </h2>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const dashboard = useDashboardStore();

const { amountFormated } = useUtils();

const $total = computed(() => dashboard.$dashboard?.totalServices);
</script>
