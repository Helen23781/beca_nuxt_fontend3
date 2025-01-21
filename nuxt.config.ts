// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  compatibilityDate: '2024-12-14',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', "@sidebase/nuxt-auth"],
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
  auth: {
    baseURL: process.env.BACKEND_URL,
    provider: {
      type: "local",
      endpoints: {
        signIn: {
          path: "/auth/login",
          method: "post"
        },
        signOut: {
          path: "/auth/logout",
          method: "post"
        },
        getSession: {
          path: "/session",
          method: "get"
        }
      },
      pages: {
        login: "/login",

      },
      session: {
        dataType: {
          id: 'number',
          nombre_usuario: 'string',
          role: "'administrador' | 'gestor'",
          twoFactorEnabled:"boolean",
          dataResponsePointer: "/",

        }
      },
      token: {
        signInResponseTokenPointer: "/accessToken",
        maxAgeInSeconds: 3600,
        type: "Bearer",
        headerName: "Authorization"
      },
      refresh: {
        isEnabled: true,
        endpoint: {
          path: '/auth/refreshToken',
          method: 'post'
        },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: '/refreshToken',
          refreshRequestTokenPointer: '/refreshToken',
          maxAgeInSeconds: 86400,
          cookieName: 'refresh_token'
        }
      }
    },
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true
    }
  }


})