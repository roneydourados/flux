<template>
  <div>
    <v-carousel v-model="internalIndex" hide-delimiters height="50">
      <template v-slot:prev="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-left"
          variant="text"
          @click="handlePrevClick(props)"
        />
      </template>

      <template v-slot:next="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-right"
          variant="text"
          @click="handleNextClick(props)"
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
import dayjs from "dayjs";

// defineModel baseado no ANO
const modelYear = defineModel({
  default: dayjs().year(),
});

const emit = defineEmits(["year"]);

// Lista de anos
const $years = computed(() => {
  const currentYear = dayjs().year();
  return Array.from({ length: currentYear + 21 - 1970 }, (_, i) => ({
    year: 1970 + i,
  }));
});

// Estado interno: índice atual no carrossel
const internalIndex = ref(0);

// Quando o ano externo mudar, atualiza o índice interno
watch(
  modelYear,
  (newYear) => {
    const idx = $years.value.findIndex((y) => y.year === newYear);
    if (idx !== -1) internalIndex.value = idx;
  },
  { immediate: true }
);

// Quando o índice interno mudar, atualiza o ano externo
watch(internalIndex, (newIndex) => {
  const year = $years.value[newIndex]?.year;
  if (year != null) {
    modelYear.value = year;
    emit("year", year);
  }
});

// Controles
const handlePrevClick = (props: any) => {
  if (props?.onClick) props.onClick();
};

const handleNextClick = (props: any) => {
  if (props?.onClick) props.onClick();
};
</script>

<!-- <template>
  <div>
    <v-carousel v-model="yearIndex" hide-delimiters height="50">
      <template v-slot:prev="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-left"
          variant="text"
          @click="handlePrevClick(props)"
        />
      </template>
      <template v-slot:next="{ props }">
        <v-btn
          size="x-small"
          icon="mdi-chevron-right"
          variant="text"
          @click="handleNextClick(props)"
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
import dayjs from "dayjs";

const yearIndex = defineModel({
  default: dayjs().year(),
});

const emit = defineEmits(["year"]);

const $years = computed(() => {
  const years = [];
  const currentYear = dayjs().year();

  for (let i = 1970; i <= currentYear + 20; i++) {
    years.push({
      year: i,
    });
  }
  return years;
});

onMounted(() => {
  //const currentYear = dayjs().year();
  const index = $years.value.findIndex((year) => year.year === currentYear);
  yearIndex.value = index;
});

const selectYear = () => {
  emit("year", $years.value[yearIndex.value].year);
};

// Métodos para lidar com os cliques
const handlePrevClick = (props: any) => {
  if (props && props.onClick) {
    props.onClick();
  }

  selectYear();
};

const handleNextClick = (props: any) => {
  if (props && props.onClick) {
    props.onClick();
  }

  selectYear();
};
</script> -->
