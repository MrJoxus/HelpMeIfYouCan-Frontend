<template lang='pug'>
  .search-address
    .form-wrapper
      h1.title Suche deine Adresse
      form(@submit='submitForm')
        input#address(v-model='address.street' type='text' name='address' placeholder='Adresse')
        input#postalcode(v-model='address.postalcode' type='text' name='postalcode' placeholder='Postleitzahl')
        input#area(v-model='address.area' type='text' name='area' placeholder='Ort')
        p.error(v-if='error') Adresse konnte nicht gefunden werden.
        button.button(type='submit') suchen
    GMap(
      :key='keyCounter'
      ref='gMap'
      :center='{lat: googleMaps.center.lat, lng: googleMaps.center.lng}'
      :options='{fullscreenControl: false, disableDefaultUI: true, styles: googleMaps.styles}'
      :zoom='googleMaps.zoom '
      )
      template(v-if='address.verified')
        GMapMarker(
          :position="{lat: address.location.lat, lng: address.location.lng}"
          :options="{icon: require('~/assets/img/002-flagge.png')}"

        )
          GMapInfoWindow
            code.
              lat: {{ address.location.lat }},
              lng: {{ address.location.lng }}
</template>

<script>
export default {
  layout: 'without-map',
  middleware: 'auth',
  data: function() {
    return {
      error: false,
      keyCounter: 0,
      address: {
        street: '',
        postalcode: '',
        area: '',
        location: { lat: 0, lng: 0 },
        verified: false
      },
      pins: {
        selected: '/assets/img/001-hilfe.png',
        notSelected: '/assets/img/001-hilfe.png'
      },
      googleMaps: {
        center: { lat: 53.565965, lng: 9.948829 },
        zoom: 13,
        styles: [
          {
            featureType: 'poi.business',
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault()

      delete this.$axios.defaults.headers.common['Authorization']
      this.address.verified = false
      let self = this
      let addressQuery = encodeURIComponent(
        `${this.address.street}, ${this.address.postalcode}, ${this.address.area}`
      )

      this.$axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?&address=${addressQuery}&key=${process.env.GOOGLE_API_KEY}`
        )
        .then(response => {
          console.log(response)
          if (response.data.results.length != 0) {
            self.error = false
            self.address.verified = true

            self.address.location = response.data.results[0].geometry.location
            self.googleMaps.center = response.data.results[0].geometry.location
            self.googleMaps.zoom = 16

            // this.$refs.gMap.map.panTo(response.data.results[0].geometry.location)
            // this.$refs.gMap.map.setZoom(17)
          } else {
            self.error = true
            self.address.location = {}
          }
          self.keyCounter++
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang='scss'>
.search-address {
  .form-wrapper {
    position: absolute;
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
  }
  .GMap {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    .GMap__Wrapper {
      height: 100%;
    }
  }
}
</style>


