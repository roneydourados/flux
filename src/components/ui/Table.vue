<template>
  <v-card class="mx-auto" flat color="background">
    <v-card-title class="pa-4">
      <v-row v-if="title" dense>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <h5 style="font-weight: 100">{{ title }}</h5>
            <slot name="title-button" />
          </div>
          <v-divider class="mt-2" />
        </v-col>
      </v-row>
      <v-row v-if="showCrud" dense align="center">
        <v-col cols="12" lg="10">
          <v-text-field
            v-model="search"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
            rounded="lg"
            @update:model-value="handleSearch"
            style="font-size: 1.4rem"
            :loading="loading"
          >
            <template #label>
              <span> Digite algo para efetuar consulta... </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" lg="2">
          <div class="d-flex align-center" style="gap: 0.5rem">
            <v-btn
              variant="flat"
              color="surface"
              class="text-none"
              size="small"
              @click="router.back()"
            >
              <v-icon icon="mdi-arrow-left"> </v-icon>
              Voltar
            </v-btn>
            <v-btn
              variant="flat"
              color="green"
              class="text-none"
              size="small"
              @click="$emit('add')"
            >
              <v-icon icon="mdi-plus"> </v-icon>
              Novo
            </v-btn>
            <slot name="button" />
          </div>
        </v-col>
      </v-row>
      <v-row v-if="showCrud" align="center">
        <slot name="filters" />
      </v-row>
    </v-card-title>
    <v-data-table
      v-if="!isVirtual"
      v-model="value"
      v-model:page="page"
      :item-value="itemValue"
      :headers="headers"
      :items="items"
      :items-per-page="itemsPerPage"
      :show-select="showSelect"
      return-object
      :loading="loading"
      sticky
      fixed-header
      no-data-text="Nenhum dado encontrado"
      loading-text="Buscando dados aguarde..."
      class="bg-transparent"
      hide-default-footer
      :density="density"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
        <slot v-if="slotProps" :name="name" v-bind="slotProps" />
        <slot v-else :name="name" v-bind="slotProps" />
      </template>

      <template v-if="showPagination && itemsPerPage < items.length" v-slot:top>
        <div class="d-flex justify-end px-4">
          <Card height="38">
            <v-pagination
              v-model="page"
              :length="pageCount"
              rounded="circle"
              density="comfortable"
              size="small"
              total-visible="4"
            />
          </Card>
        </div>
      </template>
    </v-data-table>
    <v-data-table-virtual
      v-else
      v-model="value"
      :item-value="itemValue"
      :headers="headers"
      :items="items"
      no-data-text="Nenhum dado encontrado"
      :show-select="showSelect"
      return-object
      :height="`${mobile ? '' : height}`"
      fixed-header
      sticky
      :loading="loading"
      loading-text="Buscando dados aguarde..."
      :density="density"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
        <slot v-if="slotProps" :name="name" v-bind="slotProps" />
        <slot v-else :name="name" v-bind="slotProps" />
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { uuidv7 } from "uuidv7";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

type DensityType = "comfortable" | "compact" | "default";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array as PropType<{ title: string; key: string }[]>,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
  itemsPerPage: {
    type: Number,
    default: 6,
  },
  title: {
    type: String,
    default: "Tabela",
  },
  showCrud: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: String,
    default: "550",
  },
  height: {
    type: String,
    default: "550",
  },
  showSelect: {
    type: Boolean,
    default: false,
  },
  itemValue: {
    type: String,
    default: undefined,
  },
  ignoreMobile: {
    type: Boolean,
    default: true,
  },
  isVirtual: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  density: {
    type: String as PropType<DensityType>,
    default: "default",
  },
});
const { mobile } = useDisplay();
const emit = defineEmits(["search", "add", "update:modelValue"]);
const router = useRouter();

const search = ref("");
const page = ref(1);

const handleSearch = () => {
  emit("search", search.value);
};

const pageCount = computed(() => {
  return Math.ceil(props.items.length / props.itemsPerPage);
});

const fieldName = computed<MaybeRef>(() => {
  return uuidv7();
});

const validationRules = computed<MaybeRef>(() => {
  return toTypedSchema(zod.array(zod.any()).nullish().optional());
});

const { value } = useField(fieldName, validationRules, {
  syncVModel: true,
});
</script>

<style>
.transparent-background .v-table {
  background-color: transparent !important;
}
</style>
