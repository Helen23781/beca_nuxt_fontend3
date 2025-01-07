// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  compatibilityDate: '2024-12-14',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  // postcss: {
   // plugins: {
   //   tailwindcss: {},
    //  autoprefixer: {},
   // },
  tailwindcss: {
    exposeConfig: true,
    configPath: 'tailwind.config',
    cssPath: '~/assets/css/tailwind.css',
    viewer: true
  },
  runtimeConfig: {
    public: {
      backend_url: process.env.BACKEND_URL
    }
  },

})
