<template>
  <div class="d-flex align-center flex-wrap w-100" style="gap: 0.5rem">
    <Years
      :style="`${mobile ? 'width: 100%' : 'width: 15%'}`"
      @year="$emit('year', $event)"
    />
    <v-carousel v-model="monthIndex" hide-delimiters height="50" v-if="mobile">
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
      <v-carousel-item v-for="month in $monts" :key="month.monthIndex">
        <v-sheet border="md" rounded="lg">
          <v-card flat class="pa-2" rounded="lg" color="background">
            <div dense class="d-flex align-center justify-center">
              <span>{{ month.monthFull }}</span>
            </div>
          </v-card>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <v-sheet
      rounded="lg"
      color="background"
      style="gap: 0.3rem"
      class="d-flex align-center"
      v-if="!mobile"
    >
      <v-chip
        v-for="month in $monts"
        :key="month.monthIndex"
        :color="monthIndex === month.monthIndex ? 'green-accent-2' : ''"
        @click="getMonthWithChip(month.monthIndex)"
      >
        <div dense class="d-flex align-center justify-center">
          <span>{{ month.month }}</span>
        </div>
      </v-chip>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import moment from "moment";

const monthIndex = ref(moment().month());

const emit = defineEmits(["month", "year", "click"]);
const { mobile } = useDisplay();
const $monts = computed(() => months);

// const selectMonth = () => {
//   const monthSelected = $monts.value!.filter((y) => {
//     if (y.monthIndex === monthIndex.value) {
//       return y;
//     }
//   });

//   if (monthSelected) {
//     emit("month", monthSelected[0].monthIndex);
//   } else {
//     const currentMonth = moment().month();
//     //emit("month", currentMonth);
//   }
// };

const getMonthWithChip = (month: number) => {
  const monthSelected = $monts.value!.filter((y) => {
    if (y.monthIndex === month) {
      return y;
    }
  });

  // if (monthSelected) {
  //   return monthSelected[0].month;
  // } else {
  //   return moment().month();
  // }

  if (monthSelected) {
    monthIndex.value = monthSelected[0].monthIndex;
    emit("month", monthSelected[0].monthIndex);
  } else {
    const currentMonth = moment().month();
    monthIndex.value = currentMonth;
    emit("month", currentMonth);
  }

  emit("click");
};
</script>
