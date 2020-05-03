require('dotenv').config()

export default {
  mode: 'universal',

  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto&display=swap'
      }
    ],
    script: [
      {
        src:
          'https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js',
        async: true,
        defer: true
      }
    ]
  },


  server: {
    port: 3030,
    host: '0.0.0.0'
  },

  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
  },

  serverMiddleware: {
    '/api/auth/login': '~/api/auth/login.js',
    '/api/auth/register': '~/api/auth/register.js',

    '/api/user/me/address': '~/api/user/me/address/index.js',
    '/api/user/me/': '~/api/user/me/index.js',

    '/api/help-request/accept': '~/api/help-request/accept.js',
    '/api/help-request/apply': '~/api/help-request/apply.js',
    '/api/help-request/unapply': '~/api/help-request/unapply.js',
    '/api/help-request/': '~/api/help-request/index.js',

    '/api/help-offer/accept': '~/api/help-offer/accept.js',
    '/api/help-offer/apply': '~/api/help-offer/apply.js',
    '/api/help-offer/unapply': '~/api/help-offer/unapply.js',
    '/api/help-offer/': '~/api/help-offer/index.js',

    '/api/coords/help-requests': '~/api/coords/help.js',
    '/api/coords/help-offers': '~/api/coords/offer.js'
  },

  router: {
    middleware: ['authenticated']
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'api/auth/login',
            method: 'post',
            propertyName: 'token'
          },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: 'api/user/me', method: 'get', propertyName: 'name' }
        }
      }
    },
    redirect: {
      home: '/map'
    }
  },

  loading: { color: '#fff' },

  css: ['./assets/scss/global.scss'],

  // plugins: ['~/plugins/axios.js'],

  buildModules: [],

  modules: ['@nuxtjs/axios', '@nuxtjs/dotenv', '@nuxtjs/auth'],

  axios: {
    baseURL: `http://${process.env.BASE_URL}:${process.env.BASE_PORT}`
  },

  proxy: {},

  build: {
    extend(config, ctx) { }
  }
}
