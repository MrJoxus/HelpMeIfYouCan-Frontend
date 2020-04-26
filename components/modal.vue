<template lang='pug'>
  transition(name="fade")
    .modal(@click='test()'
      v-if='modal.active'
      )
      .img-wrapper(
        :class='{"slide": flash}'
      )
        img(
          v-if='modal.img == "tick"'
          src='~assets/img/tick.png')
        img.cancel(
          v-if='modal.img == "cancel"'
          src='~assets/img/cancel.png')
</template>

<script>
export default {
  data: function() {
    return {
      slide: false
    }
  },
  computed: {
    modal() {
      return this.$store.state.modal
    },
    active() {
      return this.$store.state.modal.active
    },
    flash() {
      return this.$store.state.modal.flash
    }
  },
  methods: {
  }
}
</script>

<style lang='scss'>
.modal {
  backdrop-filter: blur(4px);
  z-index: 1001;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(238, 238, 238, 0.3);
  .img-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 256px;
    width: 256px;
    transform: translate(-50%, -50%);
    user-select: none;
    transition: all 1.5s ease;
    img.cancel{
      margin-top: 64px;
      margin-left: 64px;
      width: 50%;
    }
  }
  .slide {
    top: 48%;
    left: 52%;
  }
}
</style>
