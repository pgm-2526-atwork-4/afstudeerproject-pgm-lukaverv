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
    "@vueuse/motion/nuxt",
  ],

  vite: {
    plugins: [[tsconfigPaths()]],
  },

  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET || "your-nuxt-auth-secret",
    public: {
      cloudinary: {
        cloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
    },
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
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
