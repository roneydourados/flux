<template>
  <DialogForm
    :show="show"
    title="Cliente"
    @dialog="close"
    :width="mobile ? '100%' : '60%'"
  >
    <!-- <pre>{{ model }}</pre> -->
    <v-tabs v-model="tab" color="green">
      <v-tab
        v-for="item in menuItens"
        :key="item.id"
        :value="item.id"
        class="text-none"
      >
        <v-icon :icon="item.icon" start />
        <span v-if="!mobile">
          {{ item.title }}
        </span>
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="tabItem in menuItens"
        :key="tabItem.id"
        :value="tabItem.id"
      >
        <div v-if="tabItem.id === 1" class="py-4">
          <FormCrud :on-submit="onSubmit">
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
          </FormCrud>
        </div>
        <div v-if="tabItem.id === 2" class="py-4">
          <ClientProjectsTable />
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </DialogForm>
</template>

<script setup lang="ts">
import { formatCEP } from "@brazilian-utils/brazilian-utils";
import { type ClientProps } from "@/interfaces/Client";
import { type CepAdderssProps } from "@/interfaces/Address";
import { useDisplay } from "vuetify";

const props = defineProps({
  client: {
    type: Object as PropType<ClientProps>,
    default: () => ({} as ClientProps),
  },
});

// const projects = useProjectsStore();
const tab = ref(1);
const menuItens = ref([
  { title: "Dados", icon: "mdi-account-outline", id: 1 },
  { title: "Projetos", icon: "mdi-set-left", id: 2 },
]);
const emit = defineEmits(["close"]);
const clientStore = useClientStore();
const { formatTelephoneNumber, amountFormated } = useUtils();
const { mobile } = useDisplay();

const show = defineModel({
  default: false,
});

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

watchEffect(() => {
  if (props.client.id && show.value) {
    loadModel();
  }

  if (show.value) {
    tab.value = 1;
  }
});

const onSubmit = async () => {
  try {
    if (props.client.publicId) {
      await clientStore.update({
        publicId: props.client.publicId,
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

    clearModel();
    close();
  } catch (error) {
    console.error("🚀 ~ onSubmit ~ error:", error);
  }
};

const close = () => {
  clearModel();
  show.value = false;
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
  model.value = {
    id: props.client.id ?? 0,
    name: props.client.name ?? "",
    email: props.client.email ?? "",
    observation: props.client.observation ?? "",
    hourValueDefault: props.client.hourValueDefault
      ? String(props.client.hourValueDefault * 100)
      : "",
    phone: props.client.phone ?? "",
    cnpjCpf: props.client.cnpjCpf ?? "",

    addressZipcode: {
      text: props.client.address?.zipCode
        ? formatCEP(props.client.address?.zipCode)
        : undefined,
      address: {} as CepAdderssProps,
    },
    //@ts-ignore
    address: props.client.address
      ? {
          addressCity: props.client.address.city ?? "",
          addressDistrict: props.client.address.district ?? "",
          addressStreet: props.client.address.street ?? "",
          addressNumber: props.client.address.number ?? "",
          addressState: props.client.address.state ?? "",
          addressComplement: props.client.address.complement ?? "",
        }
      : {
          addressCity: "",
          addressDistrict: "",
          addressStreet: "",
          addressNumber: "",
          addressState: "",
          addressComplement: "",
        },
    type: props.client.type ?? "F",
  };
};

const setAddress = (address: CepAdderssProps) => {
  model.value.address.addressCity = address.localidade ?? "";
  model.value.address.addressDistrict = address.bairro ?? "";
  model.value.address.addressState = address.uf ?? "";
  model.value.address.addressComplement = address.complemento ?? "";
  model.value.address.addressStreet = address.logradouro ?? "";
};
</script>
