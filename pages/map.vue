<template lang="pug">
  .map
</template>
<script>
export default {
  layout: 'default',
  middleware: 'auth',
  data: function() {
    return {
      windowWidth: undefined,
      filter: {
        helpOffer: true,
        helpRequest: true,
        address: undefined
      }
    }
  },
  computed: {
    userLocation() {
      return this.$store.state.gmaps.userLocation
    }
  },
  watch: {
    userLocation() {
      this.getLocations(this.userLocation)
    }
  },

  methods: {
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
    onResize() {
      this.windowWidth = window.innerWidth
    }
  },
  mounted() {
    let location = {
      lat: this.userLocation.lat || this.$store.state.gmaps.center.lat,
      lng: this.userLocation.lng || this.$store.state.gmaps.center.lng
    }
    this.getLocations(location)

    this.$store.commit('gmaps/INCREMENT_CENTER_TRIGGER')
    this.$store.commit('gmaps/UPDATE_STATUS', {
      show: { filter: false, markers: false }
    })
    this.$store.commit('gmaps/UPDATE_STATUS', {
      show: { filter: true, markers: true }
    })
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style lang="scss">
.page-map {
}
</style>
