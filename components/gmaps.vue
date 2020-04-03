<template lang="pug">
  div#map(ref="map")
    div.info-window-wrapper
      div.info-window(ref="infoWindow")
        .info-window-item
          h4 {{ infoWindowContent.type }}
          p {{ infoWindowContent.description }}
          textarea(
            v-model="model.textarea"
            :class="{collapsed: !status.infoWindow.textarea}"
            )
          .options
            span.button-wrapper(v-if="!status.infoWindow.textarea")
              button.button.uncollapse(@click="uncollapseTextArea()") Kontaktier mich!
            span.button-wrapper(v-else)
              button.no-button.collapse(@click="collapseTextArea()") abbrechen
              button.button.send(@click="test()") Abschicken

</template>

<script>
let GoogleMapsApiLoader = require('google-maps-api-loader')

export default {
  data: function() {
    return {
      loaded: undefined,
      google: undefined,
      gObjects: {
        map: undefined,
        markers: [],
        currentMarker: undefined,
        infoWindow: undefined
      },
      mapParameters: {
        center: { lat: 53.565965, lng: 9.948829 },
        zoom: 13,
        options: {
          fullscreenControl: false,
          disableDefaultUI: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }
      },
      model: {
        textarea: undefined
      },
      infoWindowContent: {
        type: undefined,
        name: 'Hans',
        description: undefined
      },
      status: {
        infoWindow: {
          textarea: false
        }
      }
    }
  },
  computed: {
    store() {
      return this.$store.state.gmaps
    }
  },
  methods: {
    uncollapseTextArea() {
      this.status.infoWindow.textarea = true
      setTimeout(() => {
        this.gObjects.infoWindow.open(this.gObjects.map, this.currentMarker)
      }, 100)
    },

    collapseTextArea() {
      this.status.infoWindow.textarea = false
    },

    test() {
      console.log('test')
    },

    initMap() {
      this.gObjects.map = new google.maps.Map(
        this.$refs.map,
        this.mapParameters
      )
    },

    initMarker() {
      this.store.locations.forEach(location => {
        this.addMarker(location)
      })
    },

    addMarker(location) {
      let markerIndex = this.gObjects.markers.length
      let marker = new this.google.maps.Marker({
        position: location,
        map: this.gObjects.map
      })

      marker.addListener('click', () => {
        this.currentMarker = marker
        this.gObjects.infoWindow.close()
        this.status.infoWindow.textarea = false
        this.model.textarea = undefined
        let content = this.store.infoWindow.dummyContent[markerIndex]
        this.infoWindowContent.type = content.type
        this.infoWindowContent.description = content.description

        this.gObjects.infoWindow.open(this.gObjects.map, marker)
        let listener = this.gObjects.map.addListener('click', () => {
          google.maps.event.removeListener(listener)
          this.gObjects.infoWindow.close()
          this.status.infoWindow.textarea = false
        })
      })
      this.gObjects.markers.push(marker)
    },

    removeMarker(index) {
      this.gObjects.markers[index].setMap(null)
    },

    initInfoWindow(content) {
      this.gObjects.infoWindow = new google.maps.InfoWindow({
        content: this.$refs.infoWindow
      })
    }
  },

  async mounted() {
    try {
      const google = GoogleMapsApiLoader({
        // libraries: ['maps'],
        apiKey: process.env.GOOGLE_API_KEY
      })
      this.loaded = google
    } catch (e) {}

    this.google = await this.loaded
    this.initMap()
    this.initMarker()
    this.initInfoWindow()
  }
}
</script>
<style lang="scss">
#map {
  z-index: -1;
  position: absolute;
  top: 56px;
  left: 0;
  height: calc(100vh - 56px);
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
    resize: none;
    transition: all 0.2s ease;
  }
  .collapsed {
    height: 0px;
    opacity: 0;
    padding: 0;
  }
  .options {
    height: 49px;
    .button-wrapper {
      .send,
      .uncollapse {
        margin-right: 0;
      }
      float: right;
    }
  }
}
.gm-style .gm-style-iw-c {
  border-radius: unset;
}
.gm-ui-hover-effect {
  margin: 16px !important;
}
</style>
