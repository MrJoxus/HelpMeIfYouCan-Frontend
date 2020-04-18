<template lang='pug'>
  .map-wrapper
    .filter(v-if='store.status.show.filter')
      form(@submit='submitFilter')
        input.input.input-street(
          v-model="model.filter.address"
          @keyup=""
          type='text'
          placeholder="Straße, Plz, Ort"
          )

        .search
          .checkbox(@click="model.filter.helpRequest = !model.filter.helpRequest")
            span Anfragen
            input.input(
              v-model="model.filter.helpRequest"
              @keyup=""
              type='checkbox'
              )
          .checkbox(@click="model.filter.helpOffer = !model.filter.helpOffer")
            span Angebote
            input.input(
              v-model="model.filter.helpOffer"
              @keyup=""
              type='checkbox'
              )
          button.button(@click='submitFilter') Suchen
    //-   img.get-location(
    //-     @click="getDeviceLocation()"
    //-     src='../assets/img/crosshair.png'
    //-     )
    div#map(
      ref='map'
      )
      div.info-window-wrapper
        div.info-window(ref='infoWindow')
          .info-window-item(
            v-for='(item, index) in infoWindowContent'
            @click='status.infoWindow.item = item.id'
            :class='{"info-window-item--active": status.infoWindow.item == item.id}'
            )
            h4(v-if='item.type == "help-offer"') Moritz möchte helfen
            h4(v-if='item.type == "help-request"') Frida braucht Hilfe
            p.id request id {{ item.id }}
            p user id {{ item.user }}
            p {{ item.description }}
            textarea(
              v-model='model.parent_id[index]'
              :class='{collapsed: !status.infoWindow.textarea}'
              )
            .options
              span.button-wrapper(v-if='!status.infoWindow.textarea')
                button.button.uncollapse(@click='uncollapseTextArea()') Kontaktier mich!
              span.button-wrapper(v-else)
                button.no-button.collapse(@click='collapseTextArea()') abbrechen
                button.button.send(@click='test()') Abschicken

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
        searchMarker: undefined,
        markerCluster: undefined,
        infoWindow: undefined
      },
      mapParameters: {
        center: { lat: 53.565965, lng: 9.948829 },
        zoom: 13,
        options: {
          minZoom: 10,
          fullscreenControl: false,
          disableDefaultUI: true,
          gestureHandling: 'greedy',
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
        textarea: [],
        parent_id: [],
        searchAddress: undefined,
        filter: { helpOffer: true, helpRequest: true, address: undefined }
      },
      infoWindowContent: undefined,
      status: {
        infoWindow: {
          item: undefined,
          textarea: false
        },
        searchbar: {
          active: false,
          expand: true
        },
        geoLocation: false,
        inputFocus: false
      }
    }
  },
  computed: {
    store() {
      return this.$store.state.gmaps
    },
    center() {
      return this.$store.state.gmaps.center
    },
    showMarkers() {
      return this.$store.state.gmaps.status.show.markers
    },
    mapLoaded() {
      return this.$store.state.gmaps.status.loaded.map
    },
    locations() {
      return this.$store.state.gmaps.locations
    },
    helpOfferLocations() {
      return this.$store.state.gmaps.helpOfferLocations
    },
    helpRequestLocations() {
      return this.$store.state.gmaps.helpRequestLocations
    },
    ownLocation() {
      return this.$store.state.gmaps.ownLocation
    },
    triggerCluster() {
      return this.$store.state.gmaps.trigger.cluster
    }
  },

  watch: {
    center: function() {
      if (this.gObjects.map) {
        this.gObjects.map.panTo(this.center)
        this.gObjects.map.setZoom(16)
      }
    },
    showMarkers: function() {
      this.showMarkers ? this.showAllMarkers() : this.hideAllMarkers()
    },
    mapLoaded() {
      this.initMarker()
      this.initMarkerCluster()
      this.initInfoWindow()
    },
    locations() {
      if (this.mapLoaded) {
        let currentLength = this.gObjects.markers.length
        let newLength = this.locations.length
        let diff = newLength - currentLength
        for (let i = 0; i < diff; i++) {
          let index = i + currentLength
          this.addMarker(this.locations[index])
        }
      }
    },
    ownLocation() {
      this.mapParameters.center = { lat: this.ownLocation.latitude, lng: this.ownLocation.longitude }
      if (this.mapLoaded) {
        if (this.gObjects.searchMarker != undefined) {
          this.gObjects.searchMarker.setPosition(this.ownLocation)
        } else {
          this.gObjects.searchMarker = new this.google.maps.Marker({
            position: this.ownLocation,
            map: this.gObjects.map
          })
        }
      }
    },
    triggerCluster() {
      if (this.mapLoaded) {
        this.gObjects.markerCluster.clearMarkers()
        this.gObjects.markerCluster.addMarkers(this.gObjects.markers)
      }
    }
  },

  methods: {
    submitFilter(e) {
      e.preventDefault()

      this.clearAllMarkers()

      this.$store.dispatch('gmaps/GET_GEOLOCATION', {
        string: this.model.filter.address
      })

      if (
        this.model.filter.helpOffer == true &&
        this.model.filter.helpRequest == false
      ) {
        this.initMarker(this.helpOfferLocations)
      } else if (
        this.model.filter.helpRequest == true &&
        this.model.filter.helpOffer == false
      ) {
        this.initMarker(this.helpRequestLocations)
      } else {
        this.initMarker(this.locations)
      }
      this.$store.commit('gmaps/TRIGGER', ['cluster'])
    },
    focusHandler() {
      document.addEventListener('click', this.documentClick)
      this.status.inputFocus = true
    },
    documentClick(e) {
      let el = this.$refs.addressInput
      let target = e.target
      if (el !== target) {
        el.blur()
        this.status.inputFocus = false
        document.removeEventListener('click', this.documentClick)
      }
    },
    getDeviceLocation() {
      let success = position => {
        this.$store.commit('gmaps/UPDATE_CENTER', {
          lng: position.coords.longitude,
          lat: position.coords.latitude
        })
      }
      let error = error => {
        console.log('error', error)
      }
      navigator.geolocation.getCurrentPosition(success, error)
    },
    uncollapseTextArea() {
      this.status.infoWindow.textarea = true
      setTimeout(() => {
        this.gObjects.infoWindow.open(this.gObjects.map, this.currentMarker)
      }, 100)
    },
    collapseTextArea() {
      this.status.infoWindow.textarea = false
    },
    test(id) {
      console.log('test', id)
    },

    initMap() {
      let self = this
      var loaded = new Promise(function(resolve, reject) {
        self.gObjects.map = new self.google.maps.Map(
          self.$refs.map,
          self.mapParameters
        )
        if (self.gObjects.map) {
          resolve()
        }
      })
      loaded.then(function(value) {
        self.gObjects.map = new google.maps.Map(
          self.$refs.map,
          self.mapParameters
        )
        self.$store.commit('gmaps/UPDATE_STATUS', { loaded: { map: true } })

        self.gObjects.map.addListener('drag', () => {
          if (self.status.inputFocus) self.$refs.addressInput.blur()
        })
      })
    },
    initMarkerCluster() {
      this.gObjects.markerCluster = new MarkerClusterer(
        this.gObjects.map,
        this.gObjects.markers,
        {
          imagePath:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        }
      )
    },
    initMarker(obj) {
      if (obj == undefined) {
        this.locations.forEach(location => {
          this.addMarker(location)
        })
      } else {
        obj.forEach(location => {
          this.addMarker(location)
        })
      }
    },

    initInfoWindow(content) {
      this.gObjects.infoWindow = new google.maps.InfoWindow({
        content: this.$refs.infoWindow
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
        this.infoWindowContent = location.data

        this.gObjects.infoWindow.open(this.gObjects.map, marker)
        let listener = this.gObjects.map.addListener('click', () => {
          google.maps.event.removeListener(listener)
          this.gObjects.infoWindow.close()
          this.status.infoWindow.textarea = false
        })
      })
      this.gObjects.markers.push(marker)
    },

    hideMarker(index) {
      this.gObjects.markers[index].setMap(null)
    },

    hideAllMarkers() {
      this.gObjects.markers.forEach(marker => {
        marker.setMap(null)
      })
    },
    showAllMarkers() {
      this.gObjects.markers.forEach(marker => {
        marker.setMap(this.gObjects.map)
      })
    },
    clearAllMarkers() {
      this.gObjects.markerCluster.clearMarkers()
      this.gObjects.markers.forEach(marker => {
        marker.setMap(null)
      })
      this.gObjects.markers = []
    }
  },

  async mounted() {
    try {
      const google = GoogleMapsApiLoader({
        apiKey: process.env.GOOGLE_API_KEY
      })
      this.loaded = google
    } catch (e) {}

    this.google = await this.loaded
    this.initMap()
    if ('geolocation' in navigator) {
      this.status.geoLocation = true
    }
  }
}
</script>
<style lang="scss">
.map-wrapper {
  z-index: -1;
  position: absolute;
  top: 56px;
  left: 0;
  height: calc(100vh - 56px);
  width: 100vw;
}
#map {
  height: 100%;
  width: 100%;
}
.info-window-wrapper {
  display: none;
}

// gMaps
.info-window {
  margin: 16px;
  margin-top: 32px;
  max-width: 480px;
}
.info-window-item {
  height: 56px;
  overflow: hidden;
  margin: 16px 0;
  padding: 14px 24px;
  background: white;
  border-radius: 4px;
  border: solid 1px #cccccc;
  transition: all 0.2s ease;
  cursor: pointer;

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
    margin-top: 8px;
    height: 49px;
    .button-wrapper {
      .send,
      .uncollapse {
        margin-right: 0;
      }
      float: right;
    }
  }
  .id {
    font-size: 10px;
    margin-top: -24px;
  }
}
.info-window-item--active {
  height: auto;
  border: solid 1px #227bc0;
}
.gm-style .gm-style-iw-c {
  border-radius: unset;
}
.gm-ui-hover-effect {
  margin: 16px !important;
}
.gm-style-iw.gm-style-iw-c {
  width: 500px !important;
}
.filter {
  z-index: 1000;
  position: fixed;
  bottom: 24px;
  left: 50%;
  width: 420px;
  transform: translateX(-50%);
  background: #f7f7f7;
  padding: 16px;
  padding-top: 24px;
  box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.3);

  .checkbox {
    display: inline-block;
    cursor: pointer;
    user-select: none;
    input {
      margin: 8px 8px 16px 8px;
      width: unset;
      display: inline-block;
      cursor: pointer;
    }
  }
  .search {
    span {
      margin-left: 16px;
      cursor: pointer;
    }
  }
  .button {
    margin-right: 0;
    margin-top: 0;
    float: right;
  }
}

@media (min-width: 641px) and (max-width: 1280px) {
}
@media (max-width: 640px) {
  .map-wrapper {
    top: unset;
    height: calc(100vh - 56px);
  }
  #map {
    position: relative;
    top: unset;
    left: unset;
  }
  .gm-style-iw.gm-style-iw-c {
    width: 95vw !important;
    max-width: unset !important;
    // height: 80vh !important;
    max-height: 80vh !important;
  }
  .info-window-item {
    h4 {
      font-size: 16px;
    }
  }
  .filter {
    width: 100%;
    bottom: 0;
  }
}
</style>
