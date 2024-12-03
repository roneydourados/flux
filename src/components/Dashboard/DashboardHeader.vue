<template>
  <div class="mb-4">
    <v-row dense>
      <v-col cols="12" lg="2">
        <h2>{{ title }}</h2>
      </v-col>
      <v-col cols="12" lg="10" class="d-flex align-center justify-end">
        <Months />
        <Button color="background">
          <span style="font-weight: 100" class="text-greylight">
            Relatório de IA
          </span>
          <v-icon icon="mdi-file-table-outline" end />
        </Button>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
});
const menuMonthItems = computed(() => {
  return months.map((month) => {
    return {
      title: month.monthFull,
      icon: "",
      iconColor: "",
    };
  });
});
</script>
