<template>
  <div>
    <v-carousel
      v-model="yearIndex"
      hide-delimiters
      height="50"
      @update:modelValue="selectMonth"
    >
      <template v-slot:prev="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-left"
          variant="text"
          @click="props.onClick"
        />
      </template>
      <template v-slot:next="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-right"
          variant="text"
          @click="props.onClick"
        />
      </template>
      <v-carousel-item v-for="month in $years" :key="month.yearIndex">
        <v-sheet border="md" rounded="lg">
          <v-card flat class="pa-2" rounded="lg" color="background">
            <div dense class="d-flex align-center justify-center">
              <span>{{ month.monthFull }}</span>
            </div>
          </v-card>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
const yearIndex = ref(moment().year());

const emit = defineEmits(["month"]);

const $years = computed(() => {
  const years = [];
  const currentYear = moment().year();
  for (let i = currentYear - 20; i <= currentYear + 20; i++) {
    years.push({
      year: i,
      yearIndex: i - (currentYear - 20),
      monthFull: moment().year(i).format("YYYY"),
    });
  }
  return years;
});

const selectMonth = () => {
  const monthSelected = $years.value!.filter((y, index) => {
    if (y.yearIndex === yearIndex.value) {
      return y;
    }
  });

  if (monthSelected) {
    emit("month", monthSelected[0].yearIndex);
  } else {
    const currentMonth = moment().month();
    emit("month", currentMonth);
  }
};
</script>
