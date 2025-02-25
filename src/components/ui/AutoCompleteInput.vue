<template>
  <v-autocomplete
    ref="autocomplete"
    v-model:model-value="model"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="dynamicLabel"
    :items="items"
    variant="outlined"
    density="comfortable"
    :prepend-inner-icon="icon"
    hide-no-data
    :chips="chips"
    :return-object="returnObject"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :loading="loading"
    :error-messages="errorMessage"
    rounded="lg"
  >
    <template v-slot:item="{ props, item }">
      <slot name="items" :props="props" :item="item" />
    </template>
    <template v-slot:selection="{ item }">
      <slot name="selection" :item="item" />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { uuidv7 } from "uuidv7";

const textRequired = "Campo obrigatório";
const name = uuidv7();

const props = defineProps({
  itemTitle: {
    type: String,
    default: "",
  },
  itemValue: {
    type: String,
    default: "",
  },
  returnObject: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array as PropType<Array<any>>,
    required: true,
  },
  icon: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  chips: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Utilizando defineModel ao invés de modelValue
const model = defineModel<object | string | number>();

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const autocomplete = ref();
const nextField = ref<HTMLDivElement | null>(null);

const fieldName = computed<MaybeRef>(() => {
  return name;
});

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    if (props.returnObject) {
      return toTypedSchema(
        zod
          .object(
            {},
            {
              invalid_type_error: textRequired,
              required_error: textRequired,
            }
          )
          .required({})
          .refine((value) => Object.keys(value).length <= 0, {
            message: textRequired,
          })
      );
    }
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: textRequired,
        })
        .min(1, { message: textRequired })
        .or(zod.number().min(1, { message: textRequired }))
    );
  }
  if (props.returnObject) {
    return toTypedSchema(zod.object({}).nullish().optional());
  }
  return toTypedSchema(zod.string().nullish().optional().or(zod.number()));
});

const { errorMessage } = useField<string | object | number>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script>
