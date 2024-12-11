<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
const serviceStore = useServiceStore();
const $allServices = computed(() => serviceStore.$all);
const headers = [
  {
    title: "",
    key: "title",
  },
];
</script>
