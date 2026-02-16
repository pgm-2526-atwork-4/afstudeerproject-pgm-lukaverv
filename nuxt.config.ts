// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@sidebase/nuxt-auth"],

  auth: {
    isEnabled: true,
    originEnvKey: "NUXT_BASE_URL",
    baseURL: "http://localhost:3000/api",

    provider: {
      type: "local",

      endpoints: {
        signIn: { path: "/login", method: "post" },
        signOut: { path: "/logout", method: "post" },
        signUp: { path: "/register", method: "post" },
        getSession: { path: "/session", method: "get" },
      },

      refresh: {
        isEnabled: true,
        endpoint: { path: "/refresh", method: "post" },
        refreshOnlyToken: true,
      },

      token: {
        signInResponseTokenPointer: "Token",
        type: "Bearer",
        cookieName: "auth_token",
        headerName: "Authorization",
        maxAgeInSeconds: 1800,
        sameSiteAttribute: "lax",
        cookieDomain: "sidebase.io",
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
      },

      pages: {
        login: "/auth/login",
      },
    },

    sessionRefresh: {
      enableOnWindowFocus: true,
      enablePeriodically: true,
    },
  },
});
