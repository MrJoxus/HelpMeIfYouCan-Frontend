<template lang="pug">
  div
    navbar
    .placeholder
    nuxt
    .wrap-map
      #map
    script(src=`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&callback=initMap` async='' defer='')
    script.
      var map
        function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 53.565965, lng: 9.948829 },
            zoom: 13,
            disableDefaultUI: true,
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
          })
          var cityCircle = new google.maps.Circle({
            strokeColor: '#FFA500',
            strokeOpacity: 1,
            strokeWeight: 4,
            map: map,
            center: { lat: 53.565965, lng: 10.00 },
            radius: Math.sqrt(1) * 100
          });
          var cityCircle2 = new google.maps.Circle({
            strokeColor: '#00FF00',
            strokeOpacity: 1,
            strokeWeight: 2,
            map: map,
            center: { lat: 53.565965, lng: 9.948829 },
            radius: Math.sqrt(1) * 100
          });
        }
</template>
<script>
import navbar from '~/components/navbar.vue'

export default {
  components: { navbar }
}
</script>
<style>
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
.wrap-map {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
