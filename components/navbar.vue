<template lang='pug'>
  .navbar
    nuxt-link.navbar-title(to='/')
      h5 Help Me If You Can!
    .navbar-items
      nuxt-link.navbar-item(to='/search-address') Geocoder
      nuxt-link.navbar-item(to='/about-us') Über uns
      nuxt-link.navbar-item(to='/impressum') Impressum
      template(v-if='$auth.loggedIn')
        span.navbar-item(@click='toggleDropdown()' ref='parentDropdownMenu')  {{ $auth.user }}
      template(v-else)
        nuxt-link.navbar-item(to='/login') Login
        nuxt-link.navbar-item(to='/register') Registrieren
      template(v-if='$auth.loggedIn' )
        transition(name='fade')
          div.dropdown-menu(v-show='userInfo' ref='dropdownMenu')
            div.dropdown-item.profil-info
              p Name Nachname
              p Email
              p Telefonnummer
            hr
            nuxt-link.dropdown-item.profile.transition(@click.native='toggleDropdown()' to='/user') Zum Profil
            hr
            p.dropdown-item.logout.transition(@click='toggleDropdown()') Abmelden

</template>

<script>
export default {
  data: function() {
    return {
      userInfo: false
    }
  },
  methods: {
    toggleDropdown: function() {
      console.log("asdf")
      this.userInfo = !this.userInfo
    },
    documentClick(e) {
      let parent = this.$refs.parentDropdownMenu
      let el = this.$refs.dropdownMenu
      let target = e.target
      if (el !== target && parent !== target && !el.contains(target)) {
        this.userInfo = false
      }
    }
  },
  created() {
    document.addEventListener('click', this.documentClick)
  },
  destroyed() {
    document.removeEventListener('click', this.documentClick)
  }
}
</script>

<style lang='scss'>
$navbar-height: 56px;
.navbar {
  user-select: none;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  height: $navbar-height;
  width: 100vw;
  background: #f7f7f7;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.3);
  a {
    &:link,
    &:visited,
    &:hover,
    &:active {
      color: black;
    }
  }
  .navbar-title {
    display: inline-block;
    margin-left: $navbar-height;
    line-height: $navbar-height;
    transition: color 0.4s ease;
    cursor: pointer;
    &:hover {
      color: rgb(34, 123, 192);
    }
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
  .user-name {
    position: relative;
  }
  .dropdown-menu {
    position: absolute;
    bottom: -200px;
    right: 16px;
    min-width: 280px;
    padding-top: 16px;
    font-size: 14px;
    background: #f7f7f7;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.3);

    .dropdown-item {
      padding: 0 16px;
      &.profil-info {
        padding-bottom: 10px;
        p {
          padding-bottom: 4px;
        }
      }
      &.logout,
      &.profile {
        display: block;
        padding: 8px 16px;
        margin: 4px 0;
        cursor: pointer;
        &:hover {
          background: #cacaca;
        }
      }
    }
    hr {
      margin-top: 4px;
      margin-bottom: 4px;
    }
  }
}
</style>
