<template lang='pug'>
  .create
    .main-content
      div.headline
        h1.title Neue Anzeige
      div.request-toggle(:class='{"object--vibrate": error.type}')
        span.offer(
          :class='{"toggle-active": type == "help-offer"}'
          @click='toggleType("help-offer"), resetError("type")'
          ) Angebot
        span.help(
          :class='{"toggle-active": type == "help-request"}'
          @click='toggleType("help-request"), resetError("type")'
          ) Anfrage
      br
      p Beschreibung
      textarea(
        v-model='requestForm.description'
        @keyup='resetError("description")'
        :class='{"object--vibrate": error.description}')
      br
      p.user-item.title Adresse
      div.user-item
        input.input.input-street(
          @keyup='addressInput()'
          v-model='requestForm.address.street'
          type='text'
          name='address'
          placeholder='Straße'
          )
        input.input.input-housenumber(
          @keyup='addressInput()'
          v-model='requestForm.address.houseNumber'
          type='text'
          name='house number'
          placeholder='Nr'
          )
        input.input(
          @keyup='addressInput()'
          v-model='requestForm.address.zipCode'
          type='text'
          name='zipCode'
          placeholder='Postleitzahl'
          )
        input.input(
          @keyup='addressInput()'
          v-model='requestForm.address.district'
          type='text'
          name='district'
          placeholder='Ort'
          )
        .button-wrapper(v-if='!requestForm.coordinates.latitude')
          button.button.search-address(@click='sumbitAddressForm()') Adresse verifizieren
      gmaps(v-if='windowWidth <= 1367')
      .button-wrapper( v-if='requestForm.coordinates.latitude')
        button.button(@click='submitRequest()') Abschicken

</template>

<script>
import gmaps from '~/components/gmaps.vue'

export default {
  layout: 'default',
  components: { gmaps },
  middleware: 'auth',
  data: function() {
    return {
      windowWidth: undefined,
      type: undefined,
      requestForm: {
        address: {
          street: undefined,
          houseNumber: undefined,
          zipCode: undefined,
          district: undefined
        },
        description: '',
        coordinates: {
          latitude: undefined,
          longitude: undefined
        }
        // dateDue: '2020-06-14T23:34:30'
      },
      error: {
        description: false,
        type: false
      }
    }
  },
  computed: {
    location() {
      return this.$store.state.gmaps.createRequestLocation
    },
    address() {
      return this.$store.state.user.data.fullAddress
    }
  },
  watch: {
    location: function() {
      this.requestForm.coordinates.longitude = this.location.lng
      this.requestForm.coordinates.latitude = this.location.lat
    },
    address() {
      if (this.address != null) {
        this.setRequestform()
      }
    }
  },
  methods: {
    resetError(key) {
      this.error[key] = false
    },
    addressInput() {
      this.requestForm.coordinates.latitude = undefined
      this.requestForm.coordinates.longitude = undefined
    },
    toggleType: function(query) {
      this.type = query
      this.$router.push({ query: { type: query } })
    },
    sumbitAddressForm: function() {
      this.$store.dispatch('gmaps/GET_GEOLOCATION', {
        address: this.requestForm.address,
        type: 'createRequestLocation'
      })
    },
    submitRequest: function() {
      let self = this
      let validForm = true

      if (this.type == undefined) {
        this.error.type = true
        validForm = false
      }
      if (this.requestForm.description == '') {
        this.error.description = true
        validForm = false
      }
      let data = {
        description: this.requestForm.description,
        coordinates: this.requestForm.coordinates,
        // dateDue: this.requestForm.dateDue,
        category: 'Errands'
      }
      if (validForm) {
        this.$axios
          .post('api/' + this.type, data)
          .then(response => {
            this.$store.dispatch('modal/FLASH_MODAL', 'tick')
            this.$store.dispatch('user/REQUEST_USER')
            self.$router.push('map')
          })
          .catch(error => {
            console.log('error', error)
            this.$store.dispatch('modal/FLASH_MODAL', 'cancel')
          })
      }
    },
    setRequestform() {
      this.requestForm.address = {
        street: this.address.street || '',
        houseNumber: this.address.houseNumber || '',
        zipCode: this.address.zipCode || '',
        district: this.address.district || ''
      }
    },
    onResize() {
      this.windowWidth = window.innerWidth
    }
  },
  created() {
    if (this.address != null) {
      this.setRequestform()
    }

    this.$store.commit('gmaps/UPDATE_STATUS', { show: { markers: false } })
    this.$store.commit('gmaps/UPDATE_CREATE_REQUEST_LOCATION', {
      address: this.location,
      type: 'createRequestLocation'
    })
    this.type = this.$route.query.type
  },
  mounted() {
    this.$store.commit('gmaps/UPDATE_STATUS', {
      show: { filter: false, markers: false }
    })
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style lang='scss'>
.create {
  position: static;
  .main-content {
    position: absolute;
    top: calc(56px + 56px);
    left: 56px;
    z-index: 100;
    width: 640px;
    margin: 0 auto;
    padding: 40px;
    background: #f7f7f7;
    box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
    .object--vibrate {
      border: solid red 1px;
    }
    h1 {
      text-align: left;
    }
    .headline {
      position: relative;
    }
    .input-street {
      display: inline-block;
      width: 70%;
    }
    .input-housenumber {
      display: inline-block;

      width: 25%;
      float: right;
    }
  }
  .request-toggle {
    width: 100%;
    border: solid 1px #227bc0;
    text-align: center;
    border-radius: 4px;
    height: 40px;
    overflow: hidden;
    cursor: pointer;
    .offer {
      border-right: 1px solid #227bc0;
    }
    span {
      display: inline-block;
      height: 100%;
      width: 50%;
      line-height: 40px;
    }
    .toggle-active {
      display: inline-block;
      background-color: #227bc0;
      color: #f7f7f7;
    }
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
  .search-address {
    cursor: pointer;
    margin-right: 0;
  }
  .button-wrapper {
    height: 48px;
    text-align: right;
    button {
      margin-right: 0;
    }
    a {
      font-size: 13.33px;
      margin-right: 0;
    }
  }
}

@media (max-width: 1367px) {
  .create {
    .main-content {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      padding: 24px;
      transform: unset;
      padding-top: 56px;
      box-shadow: unset;
    }
    .map-wrapper {
      position: static;
      box-sizing: border-box;
      height: 300px;
      width: 100%;
      background: #f7f7f7;
      margin: 32px 0;
      padding: 0 16px;
      border-radius: 4px;
    }
  }
}

@media (min-width: 641px) and (max-width: 1367px) {
  .create {
    .main-content {
      width: 640px;
    }
  }
}

@media (max-width: 1281px) {
}
</style>
