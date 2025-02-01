// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  compatibilityDate: '2024-12-14',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    "@sidebase/nuxt-auth",
    "@nuxtjs/seo",
    "@zadigetvoltaire/nuxt-gtm"
  ],
   build: {
    transpile: ['vue-toastification']
  },
  css: [ 'vue-toastification/dist/index.css'],
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
  },

  robots: {
    enabled: true,
    robotsEnabledValue: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  sitemap: {
    enabled: true,
    autoLastmod: true,
    xsl: false,

  },

 app: {
    head: {
      meta: [
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/logo.jpg' },
      ],
    }
  },

  site: {
    url: "https://localhost",
    name: "Residencia Universitaria UNISS",
    description:
      "Gestionamos todos los datos de los estudiantes y profesores internos, incluyendo las becas, pisos, torres y cuartos a los que pertenecen.",
    defaultLocale: "es",
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: "Residencia Universitaria UNISS",
    },
  },
  gtm: {
    id: process.env.id_gtm || 'GTM-TRLJTCBH'
  },
})
