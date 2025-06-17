<template>
  <div>
    <Card>
      <Table
        title="Ultimos serviços"
        :headers="headers"
        :items="$services"
        :items-per-page="11"
        :show-select="false"
        :show-crud="false"
        :loading="false"
        :show-pagination="false"
      >
        <template #title-button>
          <Button
            size="small"
            variant="outlined"
            color="lightgrey"
            @click="router.push('/services')"
          >
            Ver mais
          </Button>
        </template>
        <template v-slot:item.serviceDate="{ item }">
          <div class="d-flex flex-column" style="gap: 0.5rem">
            <div class="d-flex flex-column mt-2">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center" style="gap: 0.5rem">
                  <v-sheet
                    rounded="lg"
                    height="30"
                    width="30"
                    class="d-flex align-center justify-center"
                  >
                    <ServiceSVG height="18" />
                  </v-sheet>
                  <span>{{ item.Client.name }}</span>
                </div>
                <span style="color: #66bb6a">
                  +
                  {{ amountFormated(Number(item.totalValue) ?? 0, true) }}
                </span>
              </div>
            </div>
            <span
              style="
                font-size: 0.7rem;
                font-weight: 100;
                color: rgb(var(--v-theme-grey)) !important;
              "
            >
              {{ dayjs(item.serviceDate).format("DD MMM, YYYY") }}
            </span>
          </div>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const dashboard = useDashboardStore();
const router = useRouter();
const { amountFormated } = useUtils();

const $services = computed(() => {
  return dashboard.$dashboard?.lastServices;
});

const headers = ref([{ title: "", key: "serviceDate" }]);
</script>
