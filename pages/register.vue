<template lang="pug">
  .register
    .form-wrapper
      h1.title Registrieren
      form
        input#name(type='text' placeholder="Vorname")
        input#surname(type='text' placeholder="Nachname")
        input#address(type='text' placeholder="Adresse")
        input#postalcode(type='text' placeholder="Postleitzahl")
        input#area(type='text' placeholder="Ort")
        input#email(type='email' placeholder="Email")
        input#password(type='password' placeholder="Passwort")
        input#password-confirmation(type='password' placeholder="Passwort wiederholen")
        input.button(type='submit' value='Registrieren')
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
export default {}
</script>

<style lang="scss">
.register {
  #map {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .button {
    width: 200px;
  }
}
</style>
