<template lang="pug">
  .create
    .main-content
      div.headline
        h1.title Neue Anzeige
      div.request-toggle
        span.offer(
          :class='{"toggle-active": type == "help-offer"}'
          @click='toggleType("help-offer")'
          ) Angebot
        span.help(
          :class='{"toggle-active": type == "help-request"}'
          @click='toggleType("help-request")'
          ) Anfrage
      br
      p Beschreibung
      textarea(v-model='requestForm.description')
      br
      p.user-item.title Adresse
      div.user-item
        input.input(
          @keyup="addressInput()"
          v-model="requestForm.address"
          type='text'
          name="address"
          placeholder="Straße"
          )
        input.input(
          @keyup="addressInput()"
          v-model="requestForm.postalCode"
          type='text'
          name="postalCode"
          placeholder="Postleitzahl"
          )
        input.input(
          @keyup="addressInput()"
          v-model="requestForm.area"
          type='text'
          name="area"
          placeholder="Ort")
        button.no-button.search-address(@click="sumbitAddressForm()") Adresse suchen
      button.button(v-if='requestForm.coordinates.latitude' @click='submitRequest()') Abschicken

</template>

<script>
export default {
  layout: 'with-map',
  middleware: 'auth',
  data: function() {
    return {
      type: undefined,
      requestForm: {
        address: 'berner chaussee',
        postalCode: '',
        area: '',
        description: '',
        coordinates: {
          latitude: undefined,
          longitude: undefined
        },
        dateDue: '2020-06-14T23:34:30'
      }
    }
  },
  computed: {
    coords() {
      return this.$store.state.gmaps.ownLocation
    }
  },
  watch: {
    coords: function() {
      this.requestForm.coordinates.longitude = this.coords.lng
      this.requestForm.coordinates.latitude = this.coords.lat
    }
  },
  methods: {
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
        street: this.requestForm.address,
        postlCode: this.requestForm.postalCode,
        area: this.requestForm.area
      })
    },
    submitRequest: function() {
      let self = this
      let data = {
        description: this.requestForm.description,
        coordinates: this.requestForm.coordinates,
        dateDue: this.requestForm.dateDue,
        category: 'Errands'
      }

      this.$axios
        .post('api/' + this.type, data)
        .then(response => {
          console.log('response', response)
          self.$router.push('map')
        })
        .catch(error => {
          console.log('error', error)
        })
    }
  },
  created() {
    this.$store.commit('gmaps/UPDATE_STATUS', { show: { markers: false } })
    this.type = this.$route.query.type
  }
}
</script>

<style lang="scss">
.create {
  position: static;
  background: red;
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
    h1 {
      text-align: left;
    }
    .headline {
      position: relative;
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
    float: right;
    cursor: pointer;
  }
}

@media (max-width: 640px) {
  .create {
    .main-content {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      transform: unset;
      padding-top: 56px;
    }
  }
}

@media (min-width: 641px) and (max-width: 1280px) {
  .create {
    .main-content {
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

@media (max-width: 1281px) {
}
</style>
