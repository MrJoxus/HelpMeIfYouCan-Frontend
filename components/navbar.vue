<template lang="pug">
  .navbar
    nuxt-link.navbar-title(to='/')
      h5 Help Me If You Can!
    .navbar-items
      nuxt-link.navbar-item(to='/') Über uns
      nuxt-link.navbar-item(to='/impressum') Impressum
      nuxt-link.navbar-item(to='/login') Login
      nuxt-link.navbar-item(to='/register') Registrieren
</template>

<script>
export default {}
</script>

<style lang="scss">
$navbar-height: 56px;
.navbar {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  height: $navbar-height;
  width: 100vw;
  background: #f7f7f7;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.3);
  .navbar-title {
    display: inline-block;
    margin-left: $navbar-height;
    line-height: $navbar-height;
    cursor: pointer;
  }
  .navbar-items {
    float: right;
    margin-right: $navbar-height;
  }
  .navbar-item {
    display: inline-block;
    line-height: $navbar-height;
    margin-left: 32px;
    cursor: pointer;
    border-bottom: solid 1px transparent;
    text-decoration: none;
    transition: color 0.4s ease;
    &:hover {
      color: rgb(34, 123, 192);
    }
  }
}
</style>
