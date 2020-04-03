<template lang="pug">
  div#map(ref="map")
    div.info-window-wrapper
      div.info-window(ref="infoWindow")
        .info-window-item
          h4 Gesuch/Angebot
          p Bacon ipsum dolor amet chislic cow turducken, spare ribs landjaeger chuck sausage jerky hamburger. 
            | Hamburger kielbasa burgdoggen corned beef swine tri-tip shoulder pork chop pork belly pork. 
            | Pork belly pancetta corned beef sausage.
          textarea(:class="{collapsed: !infoWindow.textareaActive}")
          .options
            button.no-button abbrechen
            button.button(@click="infoWindow.textareaActive = !infoWindow.textareaActive")  Kontaktier mich!
</template>

<script>
let GoogleMapsApiLoader = require('google-maps-api-loader')

export default {
  data: function() {
    return {
      loader: undefined,
      loaded: false,
      google: undefined,
      map: undefined,
      markers: [],
      lastMarker: undefined,
      infoWindow: {
        content: '',
        textareaActive: false
      }
    }
  },
  computed: {
    googleMaps() {
      return this.$store.state.gmaps
    }
  },
  methods: {
    test() {
      console.log('test')
    },
    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: this.googleMaps.center,
        zoom: 13,
        options: this.googleMaps.options
      })
    },

    initMarker() {
      this.googleMaps.locations.forEach(location => {
        this.addMarker(location)
      })
    },
    addMarker(location) {
      let marker = new this.google.maps.Marker({
        position: location,
        map: this.map
      })

      let infoWindow = this.initInfoWindow()
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
        content: this.$refs.infoWindow
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
.info-window-wrapper {
  display: none;
}

// gMaps
.info-window {
  margin: 16px;
  min-width: 300px;
  max-width: 400px;
}
.info-window-item {
  margin-bottom: 16px;
  p {
    font-size: 14px;
    font-weight: 400;
  }
  hr {
    margin-top: 16px;
  }
  textarea {
    height: 200px;
    opacity: 1;
    width: 100%;
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #919191;
    transition: all 0.2s ease;
  }
  .collapsed {
    height: 0px;
    opacity: 0;
    padding: 0;
  }
}
.gm-style .gm-style-iw-c {
  border-radius: unset;
}
.gm-ui-hover-effect {
  margin: 16px !important;
}
</style>
