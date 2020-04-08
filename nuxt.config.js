require('dotenv').config()

export default {
  mode: 'universal',

  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
    port: process.env.BASE_PORT,
    host: process.env.BASE_URL
  },

  serverMiddleware: {
    '/api/auth/login': '~/api/auth/login.js',
    '/api/auth/register': '~/api/auth/register.js',

    '/api/user/me/': '~/api/user/me/index.js',
    // '/api/user/me/show': '~/api/user/me/show.js',
    // '/api/user/me/delete': '~/api/user/me/delete.js',
    // '/api/user/me/update': '~/api/user/me/update.js',

    '/api/user/admin/create': '~/api/user/admin/create.js',
    '/api/user/admin/delete': '~/api/user/admin/delete.js',
    '/api/user/admin/get': '~/api/user/admin/get.js',
    '/api/user/admin/update': '~/api/user/admin/update.js'
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
        // tokenRequired: true,
        // tokenType: 'bearer'
        // autoFetchUser: true
      }
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
    extend(config, ctx) {}
  }
}
