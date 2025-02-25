<template>
  <v-select
    v-model="value"
    :label="dynamicLabel"
    :placeholder="placeholder"
    :disabled="disabled"
    :error-messages="errorMessage"
    :items="items"
    :density="density"
    :item-title="itemTitle"
    :item-value="itemValue"
    :return-object="returnObject"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    :variant="variant"
    rounded="lg"
    @blur="handleBlur"
    @input="handleChange"
  >
    <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
      <slot v-if="slotProps" :name="name" v-bind="slotProps" />
      <slot v-else :name="name" v-bind="slotProps" />
    </template>
  </v-select>
</template>

<script setup lang="ts">
type DensityType = "comfortable" | "compact" | "default";
type VariantProps =
  | "outlined"
  | "plain"
  | "filled"
  | "underlined"
  | "solo"
  | "solo-inverted"
  | "solo-filled"
  | undefined;

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
    type: Array,
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
  density: {
    type: String as PropType<DensityType>,
    default: "default",
  },
  variant: {
    type: String as PropType<VariantProps>,
    default: "outlined",
  },
});

const modelValue = defineModel({
  type: [String, Number, Object],
  default: null,
});

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

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
          .refine((value) => Object.keys(value).length > 0, {
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

const { value, errorMessage, handleBlur, handleChange } = useField(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script>

<!-- <template>
  <v-select
    v-model="value"
    :label="dynamicLabel"
    :placeholder="placeholder"
    :disabled="disabled"
    :error-messages="errorMessage"
    :items="items"
    :density="density"
    :item-title="itemTitle"
    :item-value="itemValue"
    :return-object="returnObject"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    :variant="variant"
    rounded="lg"
    @blur="handleBlur"
    @input="handleChange"
    @update:modelValue="$emit('update:modelValue')"
  >
    <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
      <slot v-if="slotProps" :name="name" v-bind="slotProps" />
      <slot v-else :name="name" v-bind="slotProps" />
    </template>
  </v-select>
</template>

<script setup lang="ts">
type DensityType = "comfortable" | "compact" | "default";
type VariantProps =
  | "outlined"
  | "plain"
  | "filled"
  | "underlined"
  | "solo"
  | "solo-inverted"
  | "solo-filled"
  | undefined;

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
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: null,
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
  density: {
    type: String as PropType<DensityType>,
    default: "default",
  },
  variant: {
    type: String as PropType<VariantProps>,
    default: "outlined",
  },
});

defineEmits(["update:modelValue"]);

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

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
          .refine((value) => Object.keys(value).length > 0, {
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

const { value, errorMessage, handleBlur, handleChange } = useField(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script> -->
