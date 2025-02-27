<template>
  <div>
    <v-card rounded="lg" color="darkgreen">
      <v-card-title>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center" style="gap: 0.5rem">
            <WalletSVG height="20" />
            <div class="d-flex flex-column justify-center">
              <span> Saldo financeiro </span>
              <span class="text-grey-lighten-1" style="font-size: 0.8rem">
                Receita + Investimento - Despesas
              </span>
            </div>
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

const $total = computed(() => dashboard.$dashboard?.totalSalt);
</script>
