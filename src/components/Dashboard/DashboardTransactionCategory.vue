<template>
  <div>
    <Card height="565">
      <Table
        title="Top Transações por categoria"
        :headers="headers"
        :items="$transactions"
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
const dashboard = useDashboardStore();

const { amountFormated } = useUtils();

const $transactions = computed(() => {
  let total = dashboard.$dashboard?.transactionsCategories.reduce(
    (acc, item) => acc + Number(item.total),
    1
  );

  if (!total) total = 1;

  return dashboard.$dashboard?.transactionsCategories
    .map((item) => ({
      category: item.category,
      value: amountFormated(item.total, true),
      total: item.total,
      percent: ((item.total / total) * 100).toFixed(2),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
});

const headers = ref([{ title: "", key: "category" }]);
</script>
