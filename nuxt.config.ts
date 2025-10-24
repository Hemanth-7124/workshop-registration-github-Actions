// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // ✅ Disable SSR since it's a client-only form app
  ssr: false,

  // ✅ Runtime configuration (no .env needed)
  runtimeConfig: {
    public: {
      appName: 'Workshop Registration System',

      // ✅ Always point to backend port 5000
      apiBase: 'http://localhost:5000/api'
    }
  },

  // ✅ Ensure Nuxt runs on port 3000, not 5000
  devServer: {
    host: 'localhost',
    port: 3000
  },

  // Optional: clear base path issues
  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/'
  },

  // ✅ Exclude server directory from build scanning
  ignore: [
    'server/**/*'
  ]
});
