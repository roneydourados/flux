<template>
  <div>
    <v-carousel
      v-model="monthIndex"
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
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
const monthIndex = ref(moment().month());

const emit = defineEmits(["month"]);

const $monts = computed(() => months);

const selectMonth = () => {
  const monthSelected = $monts.value!.filter((y, index) => {
    if (y.monthIndex === monthIndex.value) {
      return y;
    }
  });

  if (monthSelected) {
    emit("month", monthSelected[0].monthIndex);
  } else {
    const currentMonth = moment().month();
    emit("month", currentMonth);
  }
};
</script>
