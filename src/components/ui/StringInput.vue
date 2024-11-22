<template>
  <v-text-field
    v-model="value"
    :label="dynamicLabel"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="type"
    :error-messages="errorMessage"
    variant="outlined"
    density="comfortable"
    rounded="lg"
    :maxlength="maxlength"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @blur="handleBlur"
    @input="handleChange"
  />
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { uuidv7 } from "uuidv7";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
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
  type: {
    type: String,
    default: "text",
  },
  required: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: Number,
    default: 255,
  },
});

const name = uuidv7();
const textRequired = "Campo obrigatório!";
const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const fieldName = computed<MaybeRef>(() => {
  return name;
});

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: textRequired,
          required_error: textRequired,
        })
        .min(1, textRequired)
        .refine(
          (val: string) => {
            if (props.min > 0) {
              return val.length >= props.min;
            }

            return true;
          },
          {
            message: `Campo deve ter no mínimo ${props.min} caracteres!`,
          }
        )
    );
  }

  return toTypedSchema(
    zod
      .string()
      .nullish()
      .optional()
      .refine(
        (val: string | undefined | null) => {
          if (props.min > 0 && val) {
            return val.length >= props.min;
          }

          return true;
        },
        {
          message: `Campo deve ter no mínimo ${props.min} caracteres!`,
        }
      )
  );
});

const { value, errorMessage, handleBlur, handleChange } = useField<string>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
    initialValue: props.modelValue,
  }
);
</script>
