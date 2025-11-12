// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/fonts", "vuetify-nuxt-module"],
  ssr: true,

  // when enabling ssr option you need to disable inlineStyles and maybe devLogs
  features: {
    inlineStyles: false,
    devLogs: false,
  },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
  },

  css: [],

  vuetify: {
    moduleOptions: {
      // check https://nuxt.vuetifyjs.com/guide/server-side-rendering.html
      ssrClientHints: {
        reloadOnFirstRequest: false,
        viewportSize: true,
        prefersColorScheme: false,

        prefersColorSchemeOptions: {
          useBrowserThemeOnly: false,
        },
      },

      // /* If customizing sass global variables ($utilities, $reset, $color-pack, $body-font-family, etc) */
      // disableVuetifyStyles: true,
      styles: {
        configFile: "assets/settings.scss",
      },
    },
    /**
     * Vuetify theme configuration with dark mode support.
     * Enables dark theme with custom colors for form inputs and background.
     */
    ssr: true,
    defaults: {},
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            background: "#121212",
            surface: "#1E1E1E",
            primary: "#1F51FF",
            secondary: "#03DAC6",
            error: "#CF6679",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FF9800",
          },
        },
        light: {
          colors: {
            background: "#FFFFFF",
            surface: "#F5F5F5",
            primary: "#1F51FF",
            secondary: "#03DAC6",
            error: "#B00020",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FF9800",
          },
        },
      },
    },
  },
});
