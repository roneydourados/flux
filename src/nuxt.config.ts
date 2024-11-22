// // https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2024-04-03',
//   devtools: { enabled: true }
// })

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  build: {
    transpile: ["vuetify"],
  },
  imports: {
    dirs: ["store", "interfaces"],
  },
  css: ["~/assets/main.css"],
  components: [{ path: "@/components", pathPrefix: false }],
  modules: [
    "nuxt-auth-utils",
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  nitro: {
    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, PUT, DELETE",
          "access-control-allow-headers": "Content-Type, authorization",
        },
      },
    },
  },

  runtimeConfig: {
    tokenSecret: process.env.JWT_SECRET ?? "",
    public: {
      apiBaseUrl: process.env.API_BASE_URL ?? "",
    },
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
        redirectURL: process.env.NUXT_OAUTH_GOOGLE_REDIRECT_URL,
      },
    },
  },
});
