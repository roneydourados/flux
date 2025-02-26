<template>
  <div class="px-4 w-100">
    <v-row dense>
      <v-col cols="12">
        <h2>Assinatura</h2>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="3">
        <Card>
          <template #title>
            <div class="d-fex flex-column w-100">
              <div class="d-flex align-center pa-6" style="gap: 0.5rem">
                <v-chip v-if="plan.isFree" color="success">Atual</v-chip>
                <span> Plano básico </span>
              </div>
              <div
                class="d-flex align-center justify-center"
                style="gap: 0.5rem"
              >
                <svg
                  height="38"
                  viewBox="0 0 55 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.168 42V16.62H13.536C16.2 16.62 18.264 17.256 19.728 18.528C21.192 19.776 21.924 21.528 21.924 23.784C21.924 25.272 21.588 26.544 20.916 27.6C20.268 28.632 19.344 29.424 18.144 29.976C16.968 30.528 15.588 30.804 14.004 30.804L14.652 30.336H15.372C16.356 30.336 17.232 30.576 18 31.056C18.792 31.536 19.416 32.34 19.872 33.468L23.472 42H20.196L16.74 33.612C16.332 32.532 15.72 31.836 14.904 31.524C14.088 31.188 13.068 31.02 11.844 31.02H6.156V42H3.168ZM6.156 28.68H13.104C15.024 28.68 16.476 28.272 17.46 27.456C18.468 26.616 18.972 25.416 18.972 23.856C18.972 22.296 18.468 21.108 17.46 20.292C16.476 19.476 15.024 19.068 13.104 19.068H6.156V28.68ZM34.8618 46.14V41.568L35.5098 42.18C33.7818 42.156 32.1498 41.904 30.6138 41.424C29.0778 40.92 27.7338 40.164 26.5818 39.156L27.6618 36.78C28.8138 37.716 30.0258 38.412 31.2978 38.868C32.5698 39.324 34.0578 39.552 35.7618 39.552C37.8258 39.552 39.3618 39.156 40.3698 38.364C41.3778 37.548 41.8818 36.504 41.8818 35.232C41.8818 34.2 41.5098 33.384 40.7658 32.784C40.0458 32.16 38.8458 31.668 37.1658 31.308L33.5658 30.552C31.3818 30.072 29.7618 29.292 28.7058 28.212C27.6498 27.108 27.1218 25.656 27.1218 23.856C27.1218 22.464 27.4578 21.228 28.1298 20.148C28.8258 19.044 29.7858 18.18 31.0098 17.556C32.2338 16.908 33.6618 16.548 35.2938 16.476L34.8618 16.98V12.48H37.3098V16.98L36.8418 16.476C38.1138 16.524 39.4098 16.8 40.7298 17.304C42.0498 17.808 43.1658 18.564 44.0778 19.572L43.0698 21.876C42.1098 20.892 41.0418 20.184 39.8658 19.752C38.6898 19.296 37.3818 19.068 35.9418 19.068C34.1178 19.068 32.6658 19.5 31.5858 20.364C30.5058 21.228 29.9658 22.368 29.9658 23.784C29.9658 24.888 30.3018 25.776 30.9738 26.448C31.6698 27.12 32.7858 27.612 34.3218 27.924L37.9218 28.716C40.2498 29.196 41.9778 29.952 43.1058 30.984C44.2338 31.992 44.7978 33.36 44.7978 35.088C44.7978 36.456 44.4498 37.656 43.7538 38.688C43.0578 39.696 42.1098 40.5 40.9098 41.1C39.7098 41.676 38.3178 42.024 36.7338 42.144L37.3098 41.532V46.14H34.8618Z"
                    fill="white"
                  />
                </svg>

                <h1 style="font-weight: 100">0</h1>
                <span style="color: #71717a">/mês</span>
              </div>
              <v-divider class="mt-6" />
            </div>
          </template>
          <template #content>
            <div class="d-flex flex-column" style="gap: 1rem">
              <div class="d-flex align-center">
                <v-icon icon="mdi-check" color="success" start />
                <span>
                  10 Lançamentos financeiro diário
                  <span style="color: #4caf50">7</span>/10
                </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-close" start />
                <span> Relatórios de IA </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-close" start />
                <span> Módulo de serviços </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-close" start />
                <span> Faturamento de serviço por hora </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-close" start />
                <span> Gerar PDF relatórios </span>
              </div>
              <v-chip color="warning" variant="outlined" size="large">
                <div class="d-flex align-center" style="gap: 0.5rem">
                  Atualize para <strong>Standard/Full</strong>
                </div>
              </v-chip>
            </div>
          </template>
        </Card>
      </v-col>
      <v-col cols="12" lg="3">
        <Card>
          <template #title>
            <div class="d-fex flex-column w-100">
              <div class="d-flex align-center pa-6" style="gap: 0.5rem">
                <v-chip v-if="plan.isStandart" color="success">Atual</v-chip>
                <span> Plano standart </span>
              </div>
              <div
                class="d-flex align-center justify-center"
                style="gap: 0.5rem"
              >
                <svg
                  height="38"
                  viewBox="0 0 55 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.168 42V16.62H13.536C16.2 16.62 18.264 17.256 19.728 18.528C21.192 19.776 21.924 21.528 21.924 23.784C21.924 25.272 21.588 26.544 20.916 27.6C20.268 28.632 19.344 29.424 18.144 29.976C16.968 30.528 15.588 30.804 14.004 30.804L14.652 30.336H15.372C16.356 30.336 17.232 30.576 18 31.056C18.792 31.536 19.416 32.34 19.872 33.468L23.472 42H20.196L16.74 33.612C16.332 32.532 15.72 31.836 14.904 31.524C14.088 31.188 13.068 31.02 11.844 31.02H6.156V42H3.168ZM6.156 28.68H13.104C15.024 28.68 16.476 28.272 17.46 27.456C18.468 26.616 18.972 25.416 18.972 23.856C18.972 22.296 18.468 21.108 17.46 20.292C16.476 19.476 15.024 19.068 13.104 19.068H6.156V28.68ZM34.8618 46.14V41.568L35.5098 42.18C33.7818 42.156 32.1498 41.904 30.6138 41.424C29.0778 40.92 27.7338 40.164 26.5818 39.156L27.6618 36.78C28.8138 37.716 30.0258 38.412 31.2978 38.868C32.5698 39.324 34.0578 39.552 35.7618 39.552C37.8258 39.552 39.3618 39.156 40.3698 38.364C41.3778 37.548 41.8818 36.504 41.8818 35.232C41.8818 34.2 41.5098 33.384 40.7658 32.784C40.0458 32.16 38.8458 31.668 37.1658 31.308L33.5658 30.552C31.3818 30.072 29.7618 29.292 28.7058 28.212C27.6498 27.108 27.1218 25.656 27.1218 23.856C27.1218 22.464 27.4578 21.228 28.1298 20.148C28.8258 19.044 29.7858 18.18 31.0098 17.556C32.2338 16.908 33.6618 16.548 35.2938 16.476L34.8618 16.98V12.48H37.3098V16.98L36.8418 16.476C38.1138 16.524 39.4098 16.8 40.7298 17.304C42.0498 17.808 43.1658 18.564 44.0778 19.572L43.0698 21.876C42.1098 20.892 41.0418 20.184 39.8658 19.752C38.6898 19.296 37.3818 19.068 35.9418 19.068C34.1178 19.068 32.6658 19.5 31.5858 20.364C30.5058 21.228 29.9658 22.368 29.9658 23.784C29.9658 24.888 30.3018 25.776 30.9738 26.448C31.6698 27.12 32.7858 27.612 34.3218 27.924L37.9218 28.716C40.2498 29.196 41.9778 29.952 43.1058 30.984C44.2338 31.992 44.7978 33.36 44.7978 35.088C44.7978 36.456 44.4498 37.656 43.7538 38.688C43.0578 39.696 42.1098 40.5 40.9098 41.1C39.7098 41.676 38.3178 42.024 36.7338 42.144L37.3098 41.532V46.14H34.8618Z"
                    fill="white"
                  />
                </svg>

                <h1 style="font-weight: 100">19,90</h1>
                <span style="color: #71717a">/mês</span>
              </div>
              <v-divider class="mt-6" />
            </div>
          </template>
          <template #content>
            <div class="d-flex flex-column" style="gap: 1rem">
              <div class="d-flex align-center">
                <v-icon icon="mdi-check" color="success" start />
                <span> Lançamentos financeiro ilimitado </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-check" color="success" start />
                <span> Relatórios de IA </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-close" start />
                <span> Módulo de serviços </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-close" start />
                <span> Faturamento de serviço por hora </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-close" start />
                <span> Gerar PDF relatórios </span>
              </div>
              <Button
                :color="plan.isStandart ? 'red' : 'green'"
                @click="changePlan('standart')"
              >
                {{ plan.isStandart ? "Cancelar" : "Adquirir" }}
              </Button>
            </div>
          </template>
        </Card>
      </v-col>
      <v-col cols="12" lg="3">
        <Card>
          <template #title>
            <div class="d-fex flex-column w-100">
              <div class="d-flex align-center pa-6" style="gap: 0.5rem">
                <v-chip v-if="plan.isFull" color="success">Atual</v-chip>
                <span> Plano full </span>
              </div>
              <div
                class="d-flex align-center justify-center"
                style="gap: 0.5rem"
              >
                <svg
                  height="38"
                  viewBox="0 0 55 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.168 42V16.62H13.536C16.2 16.62 18.264 17.256 19.728 18.528C21.192 19.776 21.924 21.528 21.924 23.784C21.924 25.272 21.588 26.544 20.916 27.6C20.268 28.632 19.344 29.424 18.144 29.976C16.968 30.528 15.588 30.804 14.004 30.804L14.652 30.336H15.372C16.356 30.336 17.232 30.576 18 31.056C18.792 31.536 19.416 32.34 19.872 33.468L23.472 42H20.196L16.74 33.612C16.332 32.532 15.72 31.836 14.904 31.524C14.088 31.188 13.068 31.02 11.844 31.02H6.156V42H3.168ZM6.156 28.68H13.104C15.024 28.68 16.476 28.272 17.46 27.456C18.468 26.616 18.972 25.416 18.972 23.856C18.972 22.296 18.468 21.108 17.46 20.292C16.476 19.476 15.024 19.068 13.104 19.068H6.156V28.68ZM34.8618 46.14V41.568L35.5098 42.18C33.7818 42.156 32.1498 41.904 30.6138 41.424C29.0778 40.92 27.7338 40.164 26.5818 39.156L27.6618 36.78C28.8138 37.716 30.0258 38.412 31.2978 38.868C32.5698 39.324 34.0578 39.552 35.7618 39.552C37.8258 39.552 39.3618 39.156 40.3698 38.364C41.3778 37.548 41.8818 36.504 41.8818 35.232C41.8818 34.2 41.5098 33.384 40.7658 32.784C40.0458 32.16 38.8458 31.668 37.1658 31.308L33.5658 30.552C31.3818 30.072 29.7618 29.292 28.7058 28.212C27.6498 27.108 27.1218 25.656 27.1218 23.856C27.1218 22.464 27.4578 21.228 28.1298 20.148C28.8258 19.044 29.7858 18.18 31.0098 17.556C32.2338 16.908 33.6618 16.548 35.2938 16.476L34.8618 16.98V12.48H37.3098V16.98L36.8418 16.476C38.1138 16.524 39.4098 16.8 40.7298 17.304C42.0498 17.808 43.1658 18.564 44.0778 19.572L43.0698 21.876C42.1098 20.892 41.0418 20.184 39.8658 19.752C38.6898 19.296 37.3818 19.068 35.9418 19.068C34.1178 19.068 32.6658 19.5 31.5858 20.364C30.5058 21.228 29.9658 22.368 29.9658 23.784C29.9658 24.888 30.3018 25.776 30.9738 26.448C31.6698 27.12 32.7858 27.612 34.3218 27.924L37.9218 28.716C40.2498 29.196 41.9778 29.952 43.1058 30.984C44.2338 31.992 44.7978 33.36 44.7978 35.088C44.7978 36.456 44.4498 37.656 43.7538 38.688C43.0578 39.696 42.1098 40.5 40.9098 41.1C39.7098 41.676 38.3178 42.024 36.7338 42.144L37.3098 41.532V46.14H34.8618Z"
                    fill="white"
                  />
                </svg>

                <h1 style="font-weight: 100">29,90</h1>
                <span style="color: #71717a">/mês</span>
              </div>
              <v-divider class="mt-6" />
            </div>
          </template>
          <template #content>
            <div class="d-flex flex-column" style="gap: 1rem">
              <div class="d-flex align-center">
                <v-icon icon="mdi-check" color="success" start />
                <span> Lançamentos financeiro ilimitado </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-check" color="success" start />
                <span> Relatórios de IA </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-check" color="success" start />
                <span> Módulo de serviços </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-check" color="success" start />
                <span> Faturamento de serviço por hora </span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-check" color="success" start />
                <span> Gerar PDF relatórios </span>
              </div>
              <Button
                :color="plan.isFull ? 'red' : 'green'"
                @click="changePlan('full')"
              >
                {{ plan.isFull ? "Cancelar" : "Adquirir" }}
              </Button>
            </div>
          </template>
        </Card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const plan = ref({
  isFree: false,
  isStandart: true,
  isFull: false,
});

const changePlan = (type: string) => {
  if (type === "standart") {
    plan.value.isFree = plan.value.isStandart ? true : false;
    plan.value.isStandart = plan.value.isStandart ? false : true;
    plan.value.isFull = false;
  } else {
    plan.value.isFree = plan.value.isFull ? true : false;
    plan.value.isStandart = false;
    plan.value.isFull = plan.value.isFull ? false : true;
  }
};
</script>
