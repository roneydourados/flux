<template>
  <v-app>
    <!-- Hero Section -->
    <section class="py-16">
      <v-container>
        <v-row align="center" class="gap-8">
          <v-col cols="12" lg="6">
            <div class="animate-fade-up">
              <h1 class="text-h2 font-weight-bold mb-6">
                <span class="gradient-text">Timer Count</span>: Controle suas
                <span class="gradient-text">finanças</span> e
                <span class="gradient-text">tempo</span> em um só lugar
              </h1>
              <p class="text-body-1 text-grey-darken-1 mb-8">
                Com o Timer Count, você gerencia seu dinheiro e seus serviços
                por hora de forma simples e eficiente. Tome o controle da sua
                vida financeira hoje mesmo.
              </p>
              <v-btn size="x-large" color="primary" class="text-white">
                Começar com o Timer Count
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <v-img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
              alt="Timer Count Dashboard Preview"
              class="rounded-lg elevation-10 animate-fade-up"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="bg-white py-16">
      <v-container>
        <h2 class="text-h3 font-weight-bold text-center mb-12">
          Por que escolher o Timer Count?
        </h2>
        <v-row>
          <v-col
            v-for="(feature, index) in features"
            :key="index"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card class="pa-6 h-100 animate-fade-up" variant="outlined" hover>
              <v-icon
                :icon="feature.icon"
                color="primary"
                size="large"
                class="mb-4"
              />
              <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
              <p class="text-grey-darken-1">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Stats Section -->
    <section class="gradient-bg py-16">
      <v-container>
        <v-row>
          <v-col
            v-for="(stat, index) in stats"
            :key="index"
            cols="12"
            md="4"
            class="text-center animate-fade-up"
          >
            <div class="text-h3 font-weight-bold text-white mb-2">
              {{ stat.number }}
            </div>
            <div class="text-body-1 text-white opacity-90">
              {{ stat.text }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="py-16 text-center">
      <v-container>
        <h2 class="text-h3 font-weight-bold mb-6">
          Comece a transformar sua vida financeira com o Timer Count
        </h2>
        <p
          class="text-body-1 text-grey-darken-1 mb-8 mx-auto"
          style="max-width: 42rem"
        >
          Junte-se a milhares de pessoas que já estão economizando mais e
          gerenciando melhor seu tempo com o Timer Count.
        </p>
        <v-btn size="x-large" color="primary" class="text-white">
          Criar Conta Gratuita
        </v-btn>
      </v-container>
    </section>
  </v-app>
</template>

<script setup lang="ts">
const features = [
  {
    icon: "mdi-wallet",
    title: "Controle Financeiro",
    description: "Acompanhe suas receitas e despesas com facilidade",
  },
  {
    icon: "mdi-clock-outline",
    title: "Gestão de Tempo",
    description: "Registre e monitore suas horas trabalhadas",
  },
  {
    icon: "mdi-chart-bar",
    title: "Relatórios Detalhados",
    description: "Visualize seu desempenho com gráficos intuitivos",
  },
  {
    icon: "mdi-currency-usd",
    title: "Metas Financeiras",
    description: "Estabeleça e acompanhe suas metas de economia",
  },
  {
    icon: "mdi-credit-card",
    title: "Categorização",
    description: "Organize suas despesas por categorias",
  },
  {
    icon: "mdi-piggy-bank",
    title: "Economia Inteligente",
    description: "Receba dicas personalizadas de economia",
  },
];

const stats = [
  { number: "10k+", text: "Usuários do Timer Count" },
  { number: "1M+", text: "Horas Registradas" },
  { number: "R$5M+", text: "Economia Gerada" },
];
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(to right, #9b87f5, #7e69ab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-bg {
  background: linear-gradient(to right, #9b87f5, #7e69ab);
}

.animate-fade-up {
  animation: fadeUp 0.5s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
