<template lang="pug">
  .page-map

</template>
<script>
export default {
  layout: 'with-map',
  middleware: 'auth',
  data: function() {
    return {
      filter: {
        helpOffer: true,
        helpRequest: true,
        address: undefined
      }
    }
  },
  methods: {},
  mounted() {
    this.$store.dispatch('gmaps/GET_HELP_O_R_ARRAY', 'help-offer')
    this.$store.dispatch('gmaps/GET_HELP_O_R_ARRAY', 'help-request')
    this.$store.commit('gmaps/INCREMENT_CENTER_TRIGGER')
    this.$store.commit('gmaps/UPDATE_STATUS', {
      show: { filter: true, markers: true }
    })
  },
  destroyed() {
    this.$store.commit('gmaps/UPDATE_STATUS', {
      show: { filter: false, markers: false }
    })
  }
}
</script>

<style lang="scss">
.page-map {
}
</style>
