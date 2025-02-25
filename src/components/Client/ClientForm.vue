<template>
  <FormCrud :on-submit="onSubmit" :reset-form="false">
    <v-row dense>
      <v-col cols="12" lg="8">
        <StringInput label="Nome" v-model="model.name" required />
      </v-col>
      <v-col cols="12" lg="4">
        <CurrencyInput
          label="Valor Hora"
          v-model="model.hourValueDefault"
          required
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="3">
        <SelectInput
          label="Tipo de Cliente"
          v-model="model.type"
          :items="[
            { code: 'F', name: 'Física' },
            { code: 'J', name: 'Jurídica' },
          ]"
          item-title="name"
          item-value="code"
          density="comfortable"
        >
          <template #items="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="String((item as any).raw.name)"
              density="compact"
            >
            </v-list-item>
          </template>

          <template #item-selection="{ item }">
            <div class="d-flex align-center">
              <span>
                {{ (item as any).raw.name }}
              </span>
            </div>
          </template>
        </SelectInput>
      </v-col>

      <v-col cols="12" lg="9">
        <CNPJInput
          v-if="model.type === 'J'"
          label="CNPJ"
          v-model="model.cnpjCpf"
        />
        <CPFInput
          v-if="model.type === 'F'"
          label="CPF"
          v-model="model.cnpjCpf"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="3">
        <TelefoneInput label="Whatsapp" v-model="model.phone" />
      </v-col>
      <v-col cols="12" lg="9">
        <StringInput
          label="E-mail"
          type="email"
          v-model="model.email"
          required
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" lg="3">
        <CepInput
          label="Cep"
          icon="mdi-map-marker-radius-outline"
          :clearable="true"
          v-model="model.addressZipcode.text"
          @update:model-address="setAddress($event)"
        />
      </v-col>
      <v-col cols="12" lg="7">
        <StringInput
          label="Rua"
          :clearable="true"
          v-model:model-value="model.address.addressStreet"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <StringInput
          label="Nº"
          :clearable="true"
          v-model:model-value="model.address.addressNumber"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="5">
        <StringInput
          label="Bairro"
          :clearable="true"
          v-model:model-value="model.address.addressDistrict"
        />
      </v-col>
      <v-col cols="12" lg="5">
        <StringInput
          label="Cidade"
          :clearable="true"
          v-model:model-value="model.address.addressCity"
        />
      </v-col>
      <v-col cols="12" md="2">
        <StatesSelectSearch v-model="model.address.addressState" />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <StringInput
          label="Complemento"
          :clearable="true"
          v-model:model-value="model.address.addressComplement"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <TextInput label="Observações" v-model="model.observation" />
      </v-col>
    </v-row>

    <template #button>
      <v-btn
        variant="flat"
        color="surface"
        class="text-none"
        @click="$router.back()"
        rounded="xl"
      >
        <v-icon icon="mdi-arrow-left"> </v-icon>
        Voltar
      </v-btn>
    </template>
  </FormCrud>
</template>

<script setup lang="ts">
import { formatCEP } from "@brazilian-utils/brazilian-utils";
import { type CepAdderssProps } from "@/interfaces/Address";

const emit = defineEmits(["close"]);
const clientStore = useClientStore();

const $client = computed(() => clientStore.$single);

const model = ref({
  id: 0,
  name: "",
  email: "",
  observation: "",
  hourValueDefault: "",
  phone: "",
  cnpjCpf: "",
  addressZipcode: {
    text: undefined as string | undefined,
    address: {} as CepAdderssProps,
  },
  address: {
    addressCity: "",
    addressDistrict: "",
    addressStreet: "",
    addressNumber: "",
    addressState: "",
    addressComplement: "",
  },
  type: "F",
});

const onSubmit = async () => {
  try {
    if ($client.value) {
      await clientStore.update({
        publicId: $client.value.publicId,
        name: model.value.name,
        hourValueDefault: Number(model.value.hourValueDefault ?? "0"),
        address: {
          city: model.value.address.addressCity ?? undefined,
          complement: model.value.address.addressComplement ?? undefined,
          district: model.value.address.addressDistrict ?? undefined,
          number: model.value.address.addressNumber ?? undefined,
          state: model.value.address.addressState ?? undefined,
          street: model.value.address.addressStreet ?? undefined,
          zipCode: model.value.addressZipcode.text,
        },
        cnpjCpf: model.value.cnpjCpf ?? undefined,
        email: model.value.email,
        observation: model.value.observation ?? undefined,
        phone: model.value.phone,
        type: model.value.type,
      });
    } else {
      await clientStore.store({
        name: model.value.name,
        hourValueDefault: Number(model.value.hourValueDefault ?? "0"),
        address: {
          city: model.value.address.addressCity ?? undefined,
          complement: model.value.address.addressComplement ?? undefined,
          district: model.value.address.addressDistrict ?? undefined,
          number: model.value.address.addressNumber ?? undefined,
          state: model.value.address.addressState ?? undefined,
          street: model.value.address.addressStreet ?? undefined,
          zipCode: model.value.addressZipcode.text
            ? model.value.addressZipcode.text
            : undefined,
        },
        cnpjCpf: model.value.cnpjCpf ?? undefined,
        email: model.value.email,
        observation: model.value.observation ?? undefined,
        phone: model.value.phone,
        type: model.value.type,
      });
    }
  } catch (error) {
    console.error("🚀 ~ onSubmit ~ error:", error);
  }
};

const clearModel = () => {
  model.value = {
    id: 0,
    name: "",
    email: "",
    observation: "",
    hourValueDefault: "",
    phone: "",
    cnpjCpf: "",
    addressZipcode: {
      text: undefined as string | undefined,
      address: {} as CepAdderssProps,
    },
    address: {
      addressCity: "",
      addressDistrict: "",
      addressStreet: "",
      addressNumber: "",
      addressState: "",
      addressComplement: "",
    },
    type: "F",
  };
};

const loadModel = () => {
  if (!$client.value) return;

  model.value = {
    id: $client.value.id ?? 0,
    name: $client.value.name ?? "",
    email: $client.value.email ?? "",
    observation: $client.value.observation ?? "",
    hourValueDefault: $client.value.hourValueDefault
      ? String($client.value.hourValueDefault * 100)
      : "",
    phone: $client.value.phone ?? "",
    cnpjCpf: $client.value.cnpjCpf ?? "",

    addressZipcode: {
      text: $client.value.address?.zipCode
        ? formatCEP($client.value.address?.zipCode)
        : undefined,
      address: {} as CepAdderssProps,
    },

    address: $client.value.address
      ? {
          addressCity: $client.value.address.city ?? "",
          addressDistrict: $client.value.address.district ?? "",
          addressStreet: $client.value.address.street ?? "",
          addressNumber: $client.value.address.number ?? "",
          addressState: $client.value.address.state ?? "",
          addressComplement: $client.value.address.complement ?? "",
        }
      : {
          addressCity: "",
          addressDistrict: "",
          addressStreet: "",
          addressNumber: "",
          addressState: "",
          addressComplement: "",
        },
    type: $client.value.type ?? "F",
  };
};

onUnmounted(() => {
  clearModel();
});

/**
 * Quando for usar um watch, sempre deixar depois da função
 * assim evita um erro de que a função não foi definida
 */
watch(
  () => $client.value,
  () => {
    if ($client.value && model.value.id === 0) {
      loadModel();
    } else {
      clearModel();
    }
  }
);

const setAddress = (address: CepAdderssProps) => {
  model.value.address.addressCity = address.localidade ?? "";
  model.value.address.addressDistrict = address.bairro ?? "";
  model.value.address.addressState = address.uf ?? "";
  model.value.address.addressComplement = address.complemento ?? "";
  model.value.address.addressStreet = address.logradouro ?? "";
};
</script>
