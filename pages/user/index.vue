<template lang="pug">
  .user
    .main-content
      div.headline
        h1.title Dein Profil
      p(v-for="(item, itemID) in user") {{ itemID }}
        span {{ item }}

</template>

<script>
export default {
  layout: 'with-map',
  middleware: 'auth',
  methods: {},
  computed: {
    user() {
      return this.$store.state.user
    }
  }
}
</script>

<style lang="scss">
.user {
  .main-content {
    position: absolute;
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 640px;
    margin: 0 auto;
    padding: 40px;
    background: #f7f7f7;
    box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
    h1 {
      text-align: center;
    }
    p{
      span{
        float: right
      }
    }
  }
}
</style>


