<template lang='pug'>
  .map-wrapper
    transition
      .filter-expand(
        :class='{"filter-expand--hide": status.filter.active}'
        v-if='gmaps.status.show.filter'
        @click='toggleFilter()')
        img(
          src='~/assets/img/search_2.png')
    .filter(
      :class='{"filter--hide": !status.filter.active}'
      v-if='gmaps.status.show.filter')
      .toggle
        img(
          @click='toggleFilter()'
          src='~/assets/img/down-arrow.png')
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
            @click='openApplication(item.id)'
            :class='{"info-window-item--active": status.infoWindow.item == item.id}'
            )
            h4(v-if='item.type == "help-offer"') {{ item.userName }} möchte helfen
            h4(v-if='item.type == "help-request"') {{ item.userName }} braucht Hilfe
            p.id request id {{ item.id }}
            p.description {{ item.description }}
            textarea(
              @click.stop
              v-model='model.parent_id[index + item.id]'
              :class='{collapsed: !status.infoWindow.textarea}'
              )
            .options
              span.button-wrapper(v-if='!status.infoWindow.textarea')
                button.button.uncollapse(@click.stop='uncollapseTextArea()') Kontaktier mich!
              span.button-wrapper(v-else)
                button.no-button.collapse(@click.stop='collapseTextArea()') abbrechen
                button.button.send(@click='apply(item, model.parent_id[index + item.id])') Abschicken

</template>

<script>
let GoogleMapsApiLoader = require('google-maps-api-loader')

export default {
  props: ['type'],

  data: function() {
    return {
      loaded: undefined,
      lastFetchedLoacation: undefined,
      gObjects: {
        map: undefined,
        markers: [],
        currentMarker: undefined,
        userMarker: undefined,
        createRequestmarker: undefined,
        searchMarker: undefined,
        markerCluster: undefined,
        infoWindow: undefined
      },
      mapParameters: {
        center: { lat: 53.565965, lng: 9.948829 },
        zoom: 13,
        options: {
          minZoom: 11,
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
        filter: {
          active: false
        },
        geoLocation: false,
        inputFocus: false
      }
    }
  },
  computed: {
    gmaps() {
      return this.$store.state.gmaps
    },
    center() {
      return this.$store.state.gmaps.center
    },
    centerTrigger() {
      return this.$store.state.gmaps.centerTrigger
    },
    showMarkers() {
      return this.$store.state.gmaps.status.show.markers
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
    currentLocation() {
      return this.$store.state.gmaps.currentLocation
    },
    userLocation() {
      return this.$store.state.gmaps.userLocation
    },
    createRequestLocation() {
      return this.$store.state.gmaps.createRequestLocation
    },
    triggerCluster() {
      return this.$store.state.gmaps.trigger.cluster
    },
    google() {
      return this.$store.state.gmaps.google
    }
  },

  watch: {
    google() {
      if (this.google && !this.gObjects.map) {
        this.initMap()
      }
    },
    center: function() {
      if (this.gObjects.map) {
        this.gObjects.map.panTo(this.center)
        this.gObjects.map.setZoom(16)
      }
    },
    centerTrigger() {
      if (this.gObjects.map) {
        if (this.userLocation.lat != undefined) {
          this.gObjects.map.panTo(this.userLocation)
        }
      }
    },
    showMarkers: function() {
      this.showMarkers ? this.showAllMarkers() : this.clearAllMarkers()
    },

    locations() {
      if (this.gObjects.map) {
        let currentLength = this.gObjects.markers.length
        let newLength = this.locations.length
        let diff = newLength - currentLength
        for (let i = 0; i < diff; i++) {
          let index = i + currentLength
          this.addMarker(this.locations[index])
        }
      }
    },
    currentLocation() {
      this.mapParameters.center = {
        lat: this.currentLocation.lat,
        lng: this.currentLocation.lng
      }
      if (this.gObjects.map) {
        this.getLocations(this.mapParameters.center)

        this.gObjects.map.panTo(this.mapParameters.center)
      }
    },
    userLocation() {
      this.setUser()
    },
    triggerCluster() {
      if (this.gObjects.map && this.gObjects.markerCluster) {
        this.gObjects.markerCluster.clearMarkers()
        this.gObjects.markerCluster.addMarkers(this.gObjects.markers)
      } else {
        this.initMarkerCluster()
      }
    }
  },

  methods: {
    setUser() {
      if (this.userLocation.lat && this.gObjects.map) {
        this.gObjects.map.panTo(this.userLocation)
        if (this.gObjects.userMarker != undefined) {
          this.gObjects.userMarker.setPosition(this.userLocation)
        } else {
          this.gObjects.userMarker = new this.google.maps.Marker({
            position: this.userLocation,
            map: this.gObjects.map,
            icon: require('~/assets/img/user.png')
          })
        }
      }
    },
    // filter
    toggleFilter() {
      this.status.filter.active = !this.status.filter.active
    },
    submitFilter(e) {
      e.preventDefault()
      this.clearAllMarkers()
      if (this.model.filter.address != undefined) {
        this.$store.dispatch('gmaps/GET_GEOLOCATION', {
          string: this.model.filter.address,
          type: 'currentLocation'
        })
      }

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
    // infowindow
    initInfoWindow(content) {
      this.gObjects.infoWindow = new google.maps.InfoWindow({
        content: this.$refs.infoWindow
      })
    },
    apply(item, message) {
      this.$axios
        .post(`/api/${item.type}/apply/${item.id}`, { message: message })
        .then(response => {
          this.$store.dispatch('modal/FLASH_MODAL', 'tick')
          this.gObjects.infoWindow.close()
          this.$store.dispatch('user/REQUEST_USER')
        })
        .catch(error => {
          console.log('error', error)
          this.$store.dispatch('modal/FLASH_MODAL', 'cancel')
        })
    },
    openApplication(id) {
      if (this.status.infoWindow.item != id) {
        this.status.infoWindow.item = id
        this.status.infoWindow.textarea = false
      }
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
    // marker
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
    addMarker(location) {
      let markerIndex = this.gObjects.markers.length
      let marker = new this.google.maps.Marker({
        position: location,
        map: this.gObjects.map
      })

      // infowindow setup
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
      this.initMarker()
      this.gObjects.markers.forEach(marker => {
        marker.setMap(this.gObjects.map)
      })
    },

    clearAllMarkers() {
      if (this.gObjects.markerCluster) {
        this.gObjects.markerCluster.clearMarkers()
      }
      this.gObjects.markers.forEach(marker => {
        marker.setMap(null)
      })
      this.gObjects.markers = []
    },
    // fetch data
    getLocations(location) {
      this.$store.dispatch('gmaps/GET_HELP_O_R_ARRAY', {
        type: 'help-offer',
        coordinates: location
      })
      this.$store.dispatch('gmaps/GET_HELP_O_R_ARRAY', {
        type: 'help-request',
        coordinates: location
      })
    },
    fetchNewLocation() {
      let distance
      let lastLocation = this.lastFetchedLoacation
      let newLocation = {
        lat: this.gObjects.map.getCenter().lat(),
        lng: this.gObjects.map.getCenter().lng()
      }
      if (lastLocation == undefined) {
        return (this.lastFetchedLoacation = newLocation)
      }
      let point_a = new this.google.maps.LatLng(lastLocation)
      let point_b = new this.google.maps.LatLng(newLocation)

      distance =
        this.google.maps.geometry.spherical.computeDistanceBetween(
          point_a,
          point_b
        ) / 1000

      if (distance >= 150) {
        this.lastFetchedLoacation = newLocation
        this.getLocations(newLocation)
      }
    },
    // map
    initMap() {
      let loaded = new Promise((resolve, reject) => {
        this.gObjects.map = new this.google.maps.Map(
          this.$refs.map,
          this.mapParameters
        )
        if (this.gObjects.map) {
          resolve()
        }
      })
      loaded.then(() => {
        this.$store.commit('gmaps/UPDATE_STATUS', { loaded: { map: true } })
        if (this.showMarkers) {
          this.initMarker()
          this.initMarkerCluster()
        } else {
          this.clearAllMarkers()
        }
        this.initInfoWindow()
        if (this.userLocation.lat) {
          this.setUser()
        }

        this.gObjects.map.addListener('dragend', () => {
          this.fetchNewLocation()
        })
        this.gObjects.map.addListener('drag', () => {
          if (this.status.inputFocus) {
            this.$refs.addressInput.blur()
          }
        })
      })
    }
  },

  mounted() {
    if (this.google && !this.gObjects.map) {
      this.initMap()
    }
    // if ('geolocation' in navigator) {
    //   this.status.geoLocation = true
    // }
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
  p.description{
    word-break: break-all;
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
    transition: all 0.05s ease;
  }
  .collapsed {
    display: none;
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
  padding-top: 0;
  opacity: 1;
  box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
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
  .toggle {
    text-align: center;
    padding: 16px 0 8px 0;
    -webkit-tap-highlight-color: transparent;

    cursor: pointer;
    img {
      cursor: pointer;
    }
  }
}
.filter--hide {
  bottom: -250px;
  opacity: 0;
  z-index: 0;
}
.filter-expand {
  z-index: 1000;
  position: fixed;
  bottom: 24px;
  left: 50%;
  background: white;
  transform: translateX(-50%);
  opacity: 1;
  display: inline-block;
  padding: 8px 8px 6px 8px;
  text-align: center;
  user-select: none;
  border: solid 1px #227bc0;
  border-radius: 4px;
  transition: all 0.3s ease;
  img {
    width: 20px;
  }
}
.filter-expand--hide {
  opacity: 0;
  bottom: -250px;
}

@media (min-width: 641px) and (max-width: 1367px) {
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
    padding-left: 0;
  }
  .info-window-item {
    padding: 14px;
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
