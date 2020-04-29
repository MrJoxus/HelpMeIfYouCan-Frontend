<template lang="pug">
  .index
    .main-content
      div.headline
        h1.title Help Me If You Can!
        p.subtitle Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.
      .cards
        nuxt-link.card(to="/create?type=help-offer")
          h3.card-header Ich möchte helfen
          .card-image
            img(src="../assets/img/002-hilfe-1.png")
        nuxt-link.card(to="/create?type=help-request")
          h3.card-header Ich benötige Hilfe
          .card-image
            img(src="../assets/img/001-hilfe.png")
      p.subtitle Buffalo ham hock picanha short loin tongue pastrami corned beef sirloin pancetta alcatra tri-tip
        | ham venison flank kevin. Pastrami doner kevin flank, meatball pig pork brisket picanha. Picanha buffalo turkey meatloaf, tenderloin boudin shoulder hamburger brisket.
      .links
        nuxt-link.button(to="/register" v-if='!$auth.loggedIn') Registriere dich!
        nuxt-link.button(to="/map" v-if='$auth.loggedIn') Zur Karte!
      gmaps.example-map(v-if='windowWidth <= 1280')

</template>

<script>
import gmaps from '~/components/gmaps.vue'

export default {
  layout: 'default',
  components: { gmaps },
  data: function() {
    return {
      windowWidth: undefined
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    }
  },
  mounted() {
    if (!this.$store.state.user.set && this.$store.state.auth.loggedIn) {
      this.$store.dispatch('user/REQUEST_USER')
    }
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

<style lang="scss">
.index {
  position: static;
  .main-content {
    position: absolute;
    top: 50%;
    left: 50%;
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
  }
  .headline {
    .title {
      // text-shadow: 1px 0 6px rgba(0, 0, 0, 0.2);
    }
  }
  .links {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .cards {
    display: flex;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }
  .card {
    position: relative;
    width: calc(50% - 32px);
    margin: 16px;
    color: black;
  }
}

@media (max-width: 1280px) {
  .index {
    height: 100%;
    .example-map {
      box-sizing: border-box;
      height: 300px;
      background: #f7f7f7;
      padding: 32px;
      padding-top: 0;
      border-radius: 4px;
    }
    .main-content {
      position: static;
      width: 100%;
      height: 100%;
      transform: unset;
      padding-top: 56px;
      box-shadow: unset;
    }
    .card {
      width: 100%;
      flex: 1 0 200px;
    }
  }
}
@media (min-width: 641px) and (max-width: 1280px) {
  .index {
    .main-content {
      width: 640px;
    }
    .example-map {
      position: static;
      width: 100%;
      padding-top: 16px;
    }
  }
}
</style>
