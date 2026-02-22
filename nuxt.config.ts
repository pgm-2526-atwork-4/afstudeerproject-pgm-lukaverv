// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from "vite-tsconfig-paths";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@vee-validate/nuxt",
    "@sidebase/nuxt-auth",
  ],

  vite: {
    plugins: [[tsconfigPaths()]],
  },

  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET || "your-nuxt-auth-secret",
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false, // Root components without prefixes
    },
    {
      path: "~/components/inputs",
      pathPrefix: true, // Prefix with "Inputs"
    },
    {
      path: "~/components/buttons",
      pathPrefix: true, // Prefix with "Buttons"
    },
    {
      path: "~/components/modals",
      pathPrefix: true, // Prefix with "Modals"
    },
  ],

  auth: {
    provider: {
      type: "authjs",
      trustHost: false,
      defaultProvider: "github",
      addDefaultCallbackUrl: true,
    },
  },

  veeValidate: {
    autoImports: true,

    componentNames: {
      Field: "VField",
      Form: "VForm",
      FieldArray: "VFieldArray",
      ErrorMessage: "VErrorMessage",
    },
  },
});
