<template lang="pug">
	div#map(ref="map")
</template>

<script>
var GoogleMapsApiLoader = require('google-maps-api-loader')

export default {
  data: function() {
    return {
      loader: undefined,
      loaded: false,
      google: undefined,
      map: undefined,
      markers: [],
      lastMarker: undefined
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
      console.log('halal')

      this.googleMaps.locations.forEach(location => {
        this.addMarker(location)
      })
    },
    addMarker(location) {
      let marker = new this.google.maps.Marker({
        position: location,
        map: this.map
      })

      let infoWindow = this.initInfoWindow('<p>hallo</p>')
      marker.infoWindow = infoWindow
      this.markers.push(marker)
      let markerIndex = this.markers.length - 1

      this.markers[markerIndex].addListener('click', () => {
        if (this.lastMarker) this.lastMarker.infoWindow.close()
        this.lastMarker = this.markers[markerIndex]
        let test = this.map.addListener('click', () => {
          google.maps.event.removeListener(test)
          this.markers[markerIndex].infoWindow.close()
        })
        this.markers[markerIndex].infoWindow.open(
          this.map,
          this.markers[markerIndex]
        )
      })
    },

    removeMarker(index) {
      this.markers[index].setMap(null)
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
  },

  beforeDestroy() {
    this.loaded = false
  }
}
</script>
<style lang="scss">
#map {
  z-index: -1;
  position: absolute;
  top: 56px;
  left: 0;
  height: calc(100vh -56px);
  width: 100vw;
}
</style>
