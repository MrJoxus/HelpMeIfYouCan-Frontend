<template lang="pug">
  .index
    .main-content
      div.headline
        h1.title Help Me If You Can!
        p.subtitle Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.
      .cards
        nuxt-link.card(to="/register")
          h3.card-header Ich möchte helfen
          .card-image
            img(src="../assets/img/002-hilfe-1.png")
        nuxt-link.card(to="/register")
          h3.card-header Ich benötige Hilfe
          .card-image
            img(src="../assets/img/001-hilfe.png")
      p.subtitle Buffalo ham hock picanha short loin tongue pastrami corned beef sirloin pancetta alcatra tri-tip
        | ham venison flank kevin. Pastrami doner kevin flank, meatball pig pork brisket picanha. Picanha buffalo turkey meatloaf, tenderloin boudin shoulder hamburger brisket.
      .links
        nuxt-link.button(to="/register") Registriere dich!
</template>

<script>
export default {
  layout: "with-map"
}
</script>

<style lang="scss">
.index {
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
  }
  .headline {
    .title {
      text-shadow: 1px 0 6px rgba(0, 0, 0, 0.2);
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
  }
  .card {
    position: relative;
    width: 50%;
    margin: 16px;
    color: black;
  }
  #map {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
}
</style>
