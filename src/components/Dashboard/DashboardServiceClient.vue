<template>
  <div>
    <Card height="565">
      <Table
        title="Top serviços por cliente"
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :show-select="false"
        :show-crud="false"
        :loading="false"
      >
        <template v-slot:item.category="{ item }">
          <div class="d-flex flex-column" style="gap: 0.5rem">
            <div class="d-flex flex-column mt-2">
              <div class="d-flex align-center justify-space-between">
                <span>{{ item.category }}</span>
                <span>{{ item.percent }}%</span>
              </div>
              <v-progress-linear
                v-model="item.percent"
                height="15"
                rounded="xl"
                color="grey"
              />
            </div>
            <span style="font-size: 0.7rem; font-weight: 100">
              {{ item.value }}
            </span>
          </div>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
const headers = ref([
  { title: "", key: "category" },
  // { title: "Valor", key: "value" },
]);

const items = ref([
  { category: "ZDZCode", value: "R$ 1.000,00", percent: 50 },
  { category: "Juspericia", value: "R$ 500,00", percent: 10 },
  { category: "Will Facilita", value: "R$ 300,00", percent: 15 },
  { category: "Prefeitura de Campo grande", value: "R$ 200,00", percent: 12 },
  { category: "Mercado Vaz", value: "R$ 100,00", percent: 22 },
]);
</script>
