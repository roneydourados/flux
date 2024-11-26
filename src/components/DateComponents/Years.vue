<template>
  <div>
    <v-carousel
      v-model="yearIndex"
      hide-delimiters
      height="50"
      @update:modelValue="selectYear"
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
      <v-carousel-item v-for="item in $years" :key="item.year">
        <v-sheet border="md" rounded="lg">
          <v-card flat class="pa-2" rounded="lg" color="background">
            <div dense class="d-flex align-center justify-center">
              <span>{{ item.year }}</span>
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

const emit = defineEmits(["year"]);

const $years = computed(() => {
  const years = [];
  const currentYear = moment().year();

  for (let i = 1970; i <= currentYear + 20; i++) {
    years.push({
      year: i,
    });
  }
  return years;
});

onMounted(() => {
  const currentYear = moment().year();
  const index = $years.value.findIndex((year) => year.year === currentYear);
  yearIndex.value = index;

  emit("year", currentYear);
});

const selectYear = (index: number) => {
  yearIndex.value = index;
  emit("year", $years.value[index].year);
};
</script>
