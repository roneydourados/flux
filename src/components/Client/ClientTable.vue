<template>
  <div>
    <StringInput
      label="Pesquisar"
      v-model="search"
      @update:model-value="getClients(search)"
    />
    <Table
      title="Seus clientes cadastrados"
      :headers="headers"
      :items="$all"
      :show-go-back="false"
      :show-crud="false"
    >
      <template v-if="mobile" v-slot:item.name="{ item }">
        <v-list density="compact" rounded="lg" class="mb-2">
          <v-list-item density="compact">
            <template #title>
              <span>
                {{ item.name }}
              </span>
            </template>
            <template #subtitle>
              <div>
                {{ item.email }}
              </div>
              <div>
                {{ formatTelephoneNumber(item.phone) }}
              </div>
            </template>

            <template #append>
              <div class="d-flex align-center" style="gap: 0.5rem">
                <v-btn icon variant="text" size="small">
                  <EditSVG />
                </v-btn>
                <v-btn icon variant="text" size="small">
                  <DeleteSVG />
                </v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </template>

      <template v-slot:item.name="{ item }">
        {{ item.name }}
      </template>
      <template v-slot:item.email="{ item }">
        {{ item.email }}
      </template>
      <template v-slot:item.phone="{ item }">
        {{ formatTelephoneNumber(item.phone) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <div
          class="d-flex align-center justify-space-between"
          style="gap: 0.5rem"
        >
          <div class="d-flex align-center">
            <v-btn icon variant="text" size="small" @click="getEditItem(item)">
              <EditSVG />
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              @click="getDeleteItem(item)"
            >
              <DeleteSVG />
            </v-btn>
          </div>
        </div>
      </template>
    </Table>
    <DialogQuestion
      v-model="dialogDelete"
      title="Apagar cliente ?"
      :text="`Confirmar exclusão do cliente ${selected?.name}, ação não poderá ser desfeita!`"
      color-confirm="info"
      text-confirm="Liquidar"
      @cancel="dialogDelete = false"
      @confirm="handleDelete"
    />
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const router = useRouter();
const clientStore = useClientStore();
const { formatTelephoneNumber } = useUtils();
const $all = computed(() => clientStore.$all);

const loading = ref(false);
const dialogDelete = ref(false);
const selected = ref<ClientProps>();
const search = ref("");

const headers = computed(() => {
  if (mobile.value) {
    return [{ title: "", key: "name" }];
  }

  return [
    { title: "Nome", key: "name" },
    { title: "Email", key: "email" },
    { title: "Whatsapp", key: "phone" },
    { title: "Ações", key: "actions", sortable: false },
  ];
});

const getEditItem = async (item: ClientProps) => {
  await router.push(`/clients/${item.publicId}`);
};

const getDeleteItem = (item: ClientProps) => {
  selected.value = item;
  dialogDelete.value = true;
};

const handleDelete = async () => {
  dialogDelete.value = false;

  if (!selected.value || !selected.value.publicId) {
    return;
  }

  loading.value = true;

  try {
    await clientStore.destroy(selected.value.publicId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getClients = async (search: string) => {
  setTimeout(async () => {
    loading.value = true;
    try {
      await clientStore.index(search);
    } finally {
      loading.value = false;
    }
  }, 700);
};
</script>
