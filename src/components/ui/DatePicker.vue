<template>
  <v-text-field
    v-model="inputValue"
    :label="dynamicLabel"
    :error-messages="errorMessage"
    :clearable="clearable"
    :disabled="disabled"
    persistent-hint
    variant="outlined"
    density="comfortable"
    maxlength="10"
    @input="formatDateOnInput"
    @blur="validateDateOnBlur"
    rounded="lg"
  >
    <template v-slot:prepend-inner>
      <v-menu v-model="menu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            icon
            size="x-small"
            v-bind="props"
            @click="handleClickMenu"
          >
            <v-icon icon="mdi-calendar-multiselect-outline" size="20" />
          </v-btn>
        </template>
        <v-locale-provider locale="pt">
          <v-date-picker
            v-model="date"
            elevation="8"
            rounded="lg"
            hide-actions
            hide-title
            hide-header
            color="primary"
            @update:model-value="handleUpdateDatePickerData"
          />
        </v-locale-provider>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";
import { uuidv7 } from "uuidv7";

const name = uuidv7();

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
  },
});

const emit = defineEmits(["update:modelValue"]);

const date = ref(); // Armazena a data para o v-date-picker
const menu = ref(false);
const modelValue = defineModel({
  default: "",
});

const inputValue = ref(""); // Para armazenar o valor conforme o usuário digita

const fieldName = computed(() => {
  return name;
});

const dynamicLabel = computed(() =>
  props.required ? `${props.label}*` : props.label
);

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: "Data inválida",
          required_error: "Campo não pode ser vazio!",
        })
        .min(10, "Campo não pode ser vazio!")
        .refine((val) => {
          const date = new Date(val!);
          const isValid = dayjs(date, true).isValid();
          return isValid;
        }, "Data inválida")
    );
  }

  return toTypedSchema(
    zod
      .string({
        invalid_type_error: "Data inválida",
      })
      .optional()
      .nullish()
      .refine((val) => {
        const date = new Date(val!);
        const isValid = dayjs(date, true).isValid();
        return isValid;
      }, "Data inválida")
  );
});

const { value, errorMessage } = useField<string>(fieldName, validationRules, {
  syncVModel: true,
  initialValue: modelValue.value,
});

// Sincroniza o valor inicial do modelValue com o inputValue
onMounted(() => {
  if (modelValue.value) {
    inputValue.value = dayjs(modelValue.value, "YYYY-MM-DD").format(
      "DD/MM/YYYY"
    );
  }
});

// Observa alterações em modelValue para atualizar inputValue
watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue) {
      inputValue.value = dayjs(newValue, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
  }
);

const handleClickMenu = () => {
  // Abre o menu do v-date-picker e tenta carregar a data selecionada
  if (dayjs(value.value, "YYYY-MM-DD", true).isValid()) {
    date.value = dayjs(value.value, "YYYY-MM-DD").toDate();
  } else {
    date.value = null; // Limpa a data se for inválida
  }
  menu.value = true;
};

const handleUpdateDatePickerData = (newDate: Date) => {
  if (newDate) {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    inputValue.value = dayjs(newDate).format("DD/MM/YYYY");
    value.value = formattedDate;
    emit("update:modelValue", formattedDate);
    menu.value = false; // Fecha o menu
  }
};

// Função para formatar a data conforme o usuário digita
const formatDateOnInput = (event: any) => {
  let inputVal = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número

  if (inputVal.length <= 2) {
    event.target.value = inputVal; // Dia
  } else if (inputVal.length <= 4) {
    event.target.value = inputVal.slice(0, 2) + "/" + inputVal.slice(2); // Dia/Mês
  } else {
    event.target.value =
      inputVal.slice(0, 2) +
      "/" +
      inputVal.slice(2, 4) +
      "/" +
      inputVal.slice(4, 8); // Dia/Mês/Ano
  }

  inputValue.value = event.target.value;

  setValidDateApi(inputValue.value);
};

const setValidDateApi = (textDate: string) => {
  const isValid = dayjs(textDate, "DD/MM/YYYY", true).isValid();
  if (isValid) {
    const formattedDate = dayjs(textDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    value.value = formattedDate;
    emit("update:modelValue", formattedDate);
  } else {
    value.value = "";
    emit("update:modelValue", "");
  }
};

// Função para validar a data ao desfocar o campo (blur)
const validateDateOnBlur = (event: any) => {
  const inputVal = event.target.value;

  // Somente valida se a data estiver completa (10 caracteres)
  if (inputVal.length === 10) {
    const isValid = dayjs(inputVal, "DD/MM/YYYY", true).isValid();
    if (isValid) {
      const formattedDate = dayjs(inputVal, "DD/MM/YYYY").format("YYYY-MM-DD");
      value.value = formattedDate;
      emit("update:modelValue", formattedDate);
    } else {
      value.value = "";
      emit("update:modelValue", "");
    }
  } else {
    value.value = ""; // Limpa o valor se a data ainda não estiver completa
    emit("update:modelValue", "");
  }
};
</script>
