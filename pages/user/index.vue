<template lang="pug">
  .user user
</template>

<script>
export default {
  layout: 'with-map',
  middleware: 'auth'
}
</script>

<style lang="scss">
.user {
  background: red;
}
</style>


