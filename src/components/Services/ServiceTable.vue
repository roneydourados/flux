<template>
  <div>
    <Card>
      <Table
        title="Serviços"
        :headers="headers"
        :items="$allServices"
        :items-per-page="10"
        :show-select="false"
        :show-crud="false"
        :loading="false"
        :show-pagination="true"
      >
        <!-- <template v-if="mobile" v-slot:item.mobile="{ item }">
          <v-list density="compact" rounded="lg">
            <v-list-item density="compact">
              <template #title>
                <span style="width: 0.5rem">
                  {{ item.title }}
                </span>
              </template>
              <template #subtitle>
                <div class="d-flex flex-column" style="gap: 0.5rem">
                  {{ amountFormated(item.totalValue, true) }}
                  <div class="d-flex align-center">
                    <v-icon
                      :icon="getStatusIcon(item.status).icon"
                      :color="getStatusIcon(item.status).color"
                      start
                    />
                    <span>
                      {{ getStatusIcon(item.status).title }}
                    </span>
                  </div>
                </div>
              </template>

              <template #append>
                <div class="d-flex align-center" style="gap: 0.5rem">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="dialogQuestion = true"
                  >
                    <DeleteSVG />
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </template> -->
        <template v-slot:item.title="{ item }">
          <ServiceTableItemExpantionPanel :item="item" />
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
// import { useDisplay } from "vuetify";
//const { mobile } = useDisplay();

// const { amountFormated } = useUtils();
// const { calculeServiceTotals } = useServiceUtils();
const serviceStore = useServiceStore();

const $allServices = computed(() => serviceStore.$all);

// const $serviceTotals = computed(() => {
//   let totalValor = 0;
//   let totalDuration = 0;

//   serviceStore.$all.map((service) => {
//     const totals = calculeServiceTotals(service);
//     totalValor += totals.valorNumber;
//     totalDuration += totals.finalDuration.asSeconds();
//   });

//   const duracaoTotal = `${String(Math.floor(totalDuration / 3600)).padStart(
//     2,
//     "0"
//   )}:${String(Math.floor((totalDuration % 3600) / 60)).padStart(
//     2,
//     "0"
//   )}:${String(Math.floor(totalDuration) % 60).padStart(2, "0")}`;

//   return {
//     valorTotal: amountFormated(totalValor, false),
//     totalDuration: duracaoTotal,
//   };
// });

const headers = computed(() => {
  // if (mobile.value) {
  //   return [{ title: "", key: "mobile" }];
  // }
  return [{ title: "", key: "title" }];
});
</script>
