<template lang='pug'>
  div
    modal
    navbar
    .placeholder
    nuxt
    gmaps(v-if='windowWidth > 1367 || $route.fullPath == "/map"')

</template>
<script>
import gmaps from '~/components/gmaps.vue'
import navbar from '~/components/navbar.vue'
import modal from '~/components/modal.vue'
let GoogleMapsApiLoader = require('google-maps-api-loader')

export default {
  components: { navbar, modal, gmaps },
  data: function() {
    return {
      windowWidth: undefined
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    }
  },
  async mounted() {
    // load google maps
    try {
      const google = GoogleMapsApiLoader({
        apiKey: process.env.GOOGLE_API_KEY,
        libraries: ['geometry']
      })
      this.loaded = google
    } catch (e) {}
    let google = await this.loaded
    this.$store.commit('gmaps/SET_GOOGLE', google)

    // get User
    if (!this.$store.state.user.set && this.$store.state.auth.loggedIn) {
      this.$store.dispatch('user/REQUEST_USER')
    }

    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>
<style lang='scss'>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.placeholder {
  height: 56px;
}
</style>
