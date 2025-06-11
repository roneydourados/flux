// // https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2024-04-03',
//   devtools: { enabled: true }
// })

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { icons } from "./utils/pwaConfig";

const sw = true;
const pwaTheme = "#141414";

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
    "@vite-pwa/nuxt",
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
  app: {
    head: {
      title: "TimerCount",
      titleTemplate: "TimerCount - App",
      meta: [
        {
          name: "theme-color",
          content: pwaTheme,
        },
      ],
    },
  },
  pwa: {
    strategies: sw ? "injectManifest" : "generateSW",
    srcDir: sw ? "service-worker" : undefined,
    filename: sw ? "sw.ts" : undefined,
    registerType: "autoUpdate",
    manifest: {
      name: "TimerCount",
      short_name: "TimerCount",
      theme_color: pwaTheme,
      display: "standalone",
      description: "Timer Count",
      screenshots: [
        {
          src: "windows11/LargeTile.scale-200.png",
          sizes: "620x620",
          type: "image/png",
          form_factor: "narrow",
        },
        {
          src: "windows11/LargeTile.scale-200.png",
          sizes: "620x620",
          type: "image/png",
          form_factor: "wide",
        },
      ],
      icons,
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      maximumFileSizeToCacheInBytes: 5000000, // Ajuste o valor conforme necessário
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
});
