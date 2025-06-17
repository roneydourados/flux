<template>
  <div class="mb-4">
    <v-row dense>
      <v-col cols="12" lg="2">
        <h2>{{ title }}</h2>
      </v-col>
      <v-col cols="12" lg="10" class="d-flex align-center justify-end">
        <Months @month="getMonth($event)" @year="getYear($event)" />
        <!-- <Button color="background">
          <span style="font-weight: 100" class="text-greylight">
            Relatório de IA
          </span>
          <v-icon icon="mdi-file-table-outline" end />
        </Button> -->
      </v-col>
    </v-row>
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
defineProps({
  title: {
    type: String,
    default: "",
  },
});

const dashboard = useDashboardStore();
const loading = ref(false);

const filter = ref({
  month: dayjs().month(),
  year: dayjs().year(),
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
});

const getMonth = async (month: number) => {
  filter.value.month = month + 1;

  const initial = `${filter.value.year}-${filter.value.month
    .toString()
    .padStart(2, "0")}-01`;

  filter.value.initialDate = dayjs(initial).format("YYYY-MM-DD");
  filter.value.finalDate = dayjs(filter.value.initialDate)
    .endOf("month")
    .format("YYYY-MM-DD");

  await getDashboard();
};

const getYear = async (year: number) => {
  filter.value.year = year;

  const initial = `${filter.value.year}-${filter.value.month
    .toString()
    .padStart(2, "0")}-01`;

  filter.value.initialDate = dayjs(initial).format("YYYY-MM-DD");
  filter.value.finalDate = dayjs(filter.value.initialDate)
    .endOf("month")
    .format("YYYY-MM-DD");

  await getDashboard();
};

const getDashboard = async () => {
  loading.value = true;
  try {
    await dashboard.index({
      initialDate: filter.value.initialDate,
      finalDate: filter.value.finalDate,
    });
  } finally {
    loading.value = false;
  }
};
</script>
