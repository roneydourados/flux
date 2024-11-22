// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

import { MAIN_THEME, mainTheme } from "@/utils/vuetifyTheme";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: false,
    defaults: {
      global: {
        fonts: {
          family: "GeistVF",
        },
      },
    },
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme,
      },
    },
  });
  app.vueApp.use(vuetify);
});
