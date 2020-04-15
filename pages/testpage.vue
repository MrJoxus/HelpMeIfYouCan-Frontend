<template lang="pug">
  .testpage
    button.button(@click='test()') test
</template>
<script>
export default {
  layout: 'with-map',
  data: function() {
    return {}
  },
  methods: {
    test: function() {
      console.log("method test")
    }
  },
  mounted() {
    this.$store.dispatch('gmaps/GET_HELP_O_R_ARRAY', "offer")
    this.$store.dispatch('gmaps/GET_HELP_O_R_ARRAY', "request")
  }
}
</script>

<style lang="scss">
.testpage {
}
</style>
