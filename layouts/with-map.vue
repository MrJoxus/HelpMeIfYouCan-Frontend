<template lang="pug">
  div
    navbar
    .placeholder
    nuxt
    //- GMap(
    //-   ref='gMap'
    //-   :center='{lat: locations[0].lat, lng: locations[0].lng}'
    //-   :options='{fullscreenControl: false, disableDefaultUI: true, styles: googleMaps.styles}'
    //-   :zoom='13'
    //-   )
    //-   GMapMarker(
    //-     v-for="location in locations"
    //-     :key="location.id"
    //-     :position="{lat: location.lat, lng: location.lng}"
    //-     :options="{icon: require('~/assets/img/002-flagge.png')}"

    //-   )
    //-     GMapInfoWindow
    //-       code.
    //-         lat: {{ location.lat }},
    //-         lng: {{ location.lng }},
    //-         asdf: {{ location.id }}


</template>
<script>
import navbar from '~/components/navbar.vue'

export default {
  components: { navbar },
  data: function() {
    return {
      address: {
        street: '',
        postalcode: '',
        area: '',
        location: { lat: 53.6179168, lng: 10.0886449 }
      },
      currentLocation: { lat: 53.565965, lng: 9.948829 },

      locations: [
        { id: 0, lat: 53.565965, lng: 9.948829 },
        { id: 1, lat: 53.6179168, lng: 10.0886449 }
      ],
      pins: {
        selected: '/assets/img/001-hilfe.png',
        notSelected: '/assets/img/001-hilfe.png'
      },
      googleMaps: {
        styles: [
          {
            featureType: 'poi',
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
  mounted() {
    // if (!this.$store.state.user.set && this.$store.state.auth.loggedIn) {
    //   this.$store.dispatch('user/getUser')
    // }
  }
}
</script>
<style lang="scss">
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
</style>
