<template lang="pug">
  .impressum(@click='$store.commit("gmaps/TOGGLE_MARKERS")') need to add https://www.flaticon.com/de/autoren/freepik
    p Icons made by
      a(href="https://www.flaticon.com/authors/freepik" title="Freepik")  Freepik

</template>

<script>
export default {
  layout: 'default'
}
</script>

<style lang="scss">
.impressum {
  position: static;
  background: red;
}
</style>


