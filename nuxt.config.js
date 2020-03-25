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
    ]
  },

  server: {
    port: process.env.BASE_PORT,
    host: process.env.BASE_URL
  },

  router: {
    // middleware: ['auth']
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/signin',
            method: 'post',
            propertyName: 'token'
          },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/user/me', method: 'get', propertyName: 'email' }
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

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/auth',
    [
      'nuxt-gmaps',
      {
        key: process.env.GOOGLE_API_KEY
      }
    ]
  ],

  axios: {
    baseURL: `http://localhost:${process.env.BACKEND_PORT}`
  },

  proxy: {},

  build: {
    extend(config, ctx) {}
  }
}
