<template>
  <v-text-field
    v-model="inputValue"
    :label="dynamicLabel"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="type"
    :error-messages="errorMessage"
    variant="outlined"
    density="comfortable"
    rounded="lg"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @input="inputFormated($event.target.value)"
    @click:clear="clearValue"
    @keypress="onKeyPress"
  />
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { uuidv7 } from "uuidv7";

const props = defineProps({
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
});

const emit = defineEmits(["update:modelValue"]);

const name = uuidv7();
const textRequired = "Campo obrigatório!";

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const modelValue = defineModel<string | undefined>({
  default: undefined,
});

const numeralValue = ref(0);
const inputValue = ref();

const fieldName = computed<MaybeRef>(() => {
  return name;
});

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: "Valor inválido!!",
          required_error: textRequired,
        })
        .min(1, textRequired)
        .refine(
          (val: string) => {
            let valid = true;

            if (props.min > 0) {
              valid = val.length >= props.min;
            }

            if (valid) {
              if (val.includes(" ")) {
                valid = false;
              } else {
                valid = !isNaN(
                  Number(val.trim().replaceAll(".", "").replaceAll(",", ""))
                );
              }
            }

            if (!valid) {
              value.value = "";
            }

            return valid;
          },
          {
            message: "Valor inválido!!",
          }
        )
    );
  }

  return toTypedSchema(
    zod
      .string({
        invalid_type_error: textRequired,
      })
      .nullish()
      .optional()
      .refine(
        (val: string | undefined | null) => {
          let valid = true;

          if (props.min > 0 && val) {
            valid = val.length >= props.min;
          }

          if (valid && val) {
            if (val.includes(" ")) {
              valid = false;
            } else {
              valid = !isNaN(
                Number(val.trim().replaceAll(".", "").replaceAll(",", ""))
              );
            }
          }

          if (!valid) {
            value.value = "";
          }

          return valid;
        },
        {
          message: "Valor inválido!!",
        }
      )
  );
});

const onKeyPress = (event: any) => {
  const isNumber = /^[0-9]$/;
  if (!isNumber.test(event.key)) {
    event.preventDefault();
  }
};

const { value, errorMessage } = useField<string | undefined>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
    initialValue: modelValue.value
      ? modelValue.value?.replaceAll(".", "").replaceAll(",", ".")
      : undefined,
  }
);

// Sincronizar valor inicial do model com o input formatado
onMounted(() => {
  if (modelValue.value) {
    const aValue = modelValue.value?.replaceAll(".", "").replaceAll(",", ".");

    if (isNaN(Number(aValue))) {
      inputValue.value = "";
      numeralValue.value = 0;
      value.value = "";
      emit("update:modelValue", value.value);
      return;
    }

    const aValueNumber = Number(aValue) / 100;

    inputValue.value = amountFormated(aValueNumber);
    value.value = aValueNumber.toFixed(2);
  }
});

watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue) {
      const aValue = newValue.replaceAll(".", "").replaceAll(",", ".");
      if (isNaN(Number(aValue))) {
        inputValue.value = "";
        numeralValue.value = 0;
        value.value = "";
        emit("update:modelValue", value.value);
        return;
      }
      inputFormated(newValue);
    } else {
      // corrigido porque estava dando problema ao limpar o campo
      inputValue.value = "";
      numeralValue.value = 0;
      value.value = "";
      emit("update:modelValue", value.value);
    }
  }
);

const inputFormated = (event: string) => {
  const digitedValue = event;
  const asValue = digitedValue
    .replaceAll(".", "")
    .replaceAll(",", "")
    .replaceAll("R$", "");

  if (asValue.length >= 21) {
    inputValue.value = "";
    numeralValue.value = 0;
    value.value = "";
    emit("update:modelValue", numeralValue.value);

    return;
  }

  numeralValue.value = Number(asValue) / 100;

  if (numeralValue.value < 0) {
    inputValue.value = "";
    numeralValue.value = 0;
    value.value = "";
    emit("update:modelValue", value.value);
    return;
  }

  if (numeralValue.value > 0) {
    emit("update:modelValue", numeralValue.value.toFixed(2));
    inputValue.value = amountFormated(numeralValue.value);
    value.value = numeralValue.value.toFixed(2);
  }
};

const clearValue = () => {
  emit("update:modelValue", "");
};

const amountFormated = (valueCurrency: number) => {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valueCurrency);
};
</script>
