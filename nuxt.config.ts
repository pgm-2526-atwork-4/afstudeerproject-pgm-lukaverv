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
    "@pinia/nuxt",
  ],

  app: {
    head: {
      title: "Beatstack",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        // Basic favicon
        { rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico" },

        // Standard sizes
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon/favicon-32x32.png",
        },

        // Apple devices
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-touch-icon.png",
        },

        // Android devices and PWA
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/favicon/android-chrome-192x192.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "512x512",
          href: "/favicon/android-chrome-512x512.png",
        },

        // Web App Manifest
        { rel: "manifest", href: "/favicon/site.webmanifest" },
      ],
    },
  },

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
    baseURL:
      process.env.BASE_URL ||
      process.env.NUXT_AUTH_ORIGIN ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
    provider: {
      type: "authjs",
      trustHost: true,
      defaultProvider: "github",
      addDefaultCallbackUrl: true,
    },
    globalAppMiddleware: {
      isEnabled: false,
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
