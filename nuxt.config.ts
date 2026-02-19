// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from "vite-tsconfig-paths";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@vee-validate/nuxt"],

  vite: {
    plugins: [[tsconfigPaths()]],
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
