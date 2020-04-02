<template lang='pug'>
  div
    navbar
    .placeholder
    br
    p(@click="removeMarker()") btn
    nuxt
    div#map(ref="map")
    //- .info-window
    //-   .info-window-item
    //-     p hallo

</template>
<script>
var GoogleMapsApiLoader = require('google-maps-api-loader')
import navbar from '~/components/navbar.vue'

export default {
  components: { navbar },
  data: function() {
    return {
      loader: undefined,
      loaded: false,
      google: undefined,
      map: undefined,
      markers: []
    }
  },
  computed: {
    googleMaps() {
      return this.$store.state.gmaps
    }
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: this.googleMaps.center,
        zoom: 13,
        options: this.googleMaps.options
      })
    },

    initMarker() {
      let marker = new this.google.maps.Marker({
        position: { lat: 53.565965, lng: 9.948829 },
        map: this.map
      })

      let infoWindow = this.initInfoWindow("<p>hallo</p>")
      marker.infoWindow = infoWindow
      this.markers.push(marker)
      let markerIndex = this.markers.length - 1

      this.markers[markerIndex].addListener('click', ()=> {
        this.markers[markerIndex].infoWindow.open(
          this.map,
          this.markers[markerIndex]
        )
      })
    },

    removeMarker() {
      this.markers[0].setMap(null)
    },

    initInfoWindow(content) {
      return new google.maps.InfoWindow({
        content: `<div class="info-window"><div class="info-window-item"><p>hallo</p></div></div>`
      })
    }
  },

  async mounted() {
    if (this.loaded === false) {
      this.loaded = true
      try {
        const google = GoogleMapsApiLoader({
          // libraries: ['maps'],
          apiKey: process.env.GOOGLE_API_KEY
        })
        this.loader = google
      } catch (e) {}
    }

    this.google = await this.loader
    this.initMap()
    this.initMarker()

    // BEHALTEN
    // if (!this.$store.state.user.set && this.$store.state.auth.loggedIn) {
    //   this.$store.dispatch('user/requestUser')
    // }
  },

  beforeDestroy() {
    this.loaded = false
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
#map {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}
</style>
