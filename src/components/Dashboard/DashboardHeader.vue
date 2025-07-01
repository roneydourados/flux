<template>
  <div class="mb-4">
    <v-row dense>
      <v-col cols="12" lg="2">
        <h2>{{ title }}</h2>
      </v-col>
      <v-col cols="12" lg="10" class="d-flex align-center justify-end">
        <Months
          v-model:month="filter.month"
          v-model:year="filter.year"
          @month="getMonth"
          @year="getYear"
        />
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

const getMonth = async () => {
  // filter.value.month = month + 1;

  // const initial = `${filter.value.year}-${filter.value.month
  //   .toString()
  //   .padStart(2, "0")}-01`;

  // filter.value.initialDate = dayjs(initial).format("YYYY-MM-DD");
  // filter.value.finalDate = dayjs(filter.value.initialDate)
  //   .endOf("month")
  //   .format("YYYY-MM-DD");

  const m = Number(filter.value.month) + 1;
  const selectMonth = m < 10 ? `0${m}` : m.toString();

  filter.value.initialDate = dayjs(
    `${filter.value.year}-${selectMonth}`
  ).format("YYYY-MM-DD");

  filter.value.finalDate = dayjs(filter.value.initialDate)
    .endOf("month")
    .format("YYYY-MM-DD");

  await getDashboard();
};

const getYear = async () => {
  // filter.value.year = year;

  // const initial = `${filter.value.year}-${filter.value.month
  //   .toString()
  //   .padStart(2, "0")}-01`;

  // filter.value.initialDate = dayjs(initial).format("YYYY-MM-DD");
  // filter.value.finalDate = dayjs(filter.value.initialDate)
  //   .endOf("month")
  //   .format("YYYY-MM-DD");

  const selectMonth = dayjs(filter.value.initialDate).format("MM");

  filter.value.initialDate = dayjs(
    `${filter.value.year}-${selectMonth}-01`
  ).format("YYYY-MM-DD");
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
