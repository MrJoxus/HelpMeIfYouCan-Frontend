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

</template>

<script>
export default {
  layout: 'with-map',
  middleware: 'auth',
  data: function() {
    return {
      error: false,
      address: {
        street: '',
        postalcode: '',
        area: '',
        location: { lat: 0, lng: 0 },
        verified: false
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
      this.$store.dispatch('locations/GET_GEOLOCATION', {
        street: this.address.street,
        postlCode: this.address.postalcode,
        area: this.address.area
      })
    }
  }
}
</script>

<style lang='scss'>
.search-address {
  .form-wrapper {
    position: absolute;
    top: calc(56px + 56px);
    left: 56px;
    transform: translate(0, 0);
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


