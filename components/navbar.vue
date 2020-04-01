<template lang='pug'>
  .navbar
    .navbar-title
      nuxt-link(to='/')
        h5(@click="closeNavbbarItems()") Help Me If You Can!
      div.navbar-items-trigger.show-on-mobile(@click="toggleNavbbarItems()")
        .hamburger
          div.hamburger-item
          div.hamburger-item
          div.hamburger-item
    .navbar-items(@click="toggleNavbbarItems()" v-show='navbarItems')
      nuxt-link.navbar-item(to='/search-address') Geocoder
      nuxt-link.navbar-item(to='/about-us') Über uns
      nuxt-link.navbar-item(to='/impressum') Impressum
      template(v-if='$auth.loggedIn')
        span.navbar-item.dropdown-trigger.hide-on-mobile(@click='toggleDropdown()' ref='parentDropdownMenu')  {{ $auth.user }}
      template(v-else)
        nuxt-link.navbar-item(to='/login') Login
        nuxt-link.navbar-item(to='/register') Registrieren
      template(v-if='$auth.loggedIn' )
        transition(name='fade')
          div.dropdown-menu.show-on-mobile(v-show='dropdown' ref='dropdownMenu')
            div.dropdown-item.profil-info.hide-on-mobile
              p {{user.name}} {{user.lastName}}
              p {{user.email}}
            hr
            nuxt-link.dropdown-item.profile.transition(@click.native='toggleDropdown()' to='/user') Zum Profil
            hr
            p.dropdown-item.logout.transition(@click='toggleDropdown()') Abmelden

</template>

<script>
export default {
  data: function() {
    return {
      dropdown: false,
      navbarItems: true,
      window: {
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        width: 0,
        height: 0
      }
    }
  },

  methods: {
    toggleDropdown: function() {
      this.dropdown = !this.dropdown
    },
    toggleNavbbarItems: function() {
      if (this.window.isMobile) {
        this.navbarItems = !this.navbarItems
      }
    },
    closeNavbbarItems: function() {
      console.log("test")
      if (this.window.isMobile) {
        this.navbarItems = false
      }
    },
    documentClick(e) {
      let parent = this.$refs.parentDropdownMenu
      let el = this.$refs.dropdownMenu
      let target = e.target
      if (el !== target && parent !== target && !el.contains(target)) {
        this.dropdown = false
      }
    },
    test: function() {
      console.log('test')
    },
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      if (window.innerWidth <= 640) {
        this.window.isMobile = true
        this.window.isTablet = false
        this.window.isDesktop = false
      } else if (window.innerWidth >= 640 && window.innerWidth <= 1280) {
        this.window.isMobile = false
        this.window.isTablet = true
        this.window.isDesktop = false
      }
      if (window.innerWidth >= 1281) {
        this.window.isMobile = false
        this.window.isTablet = false
        this.window.isDesktop = true
      }
    }
  },

  computed: {
    user() {
      return this.$store.state.user.data
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    if (window.innerWidth <= 640) {
      this.navbarItems = false
    }
    this.handleResize()
    if (this.$store.state.auth.loggedIn) {
      document.addEventListener('click', this.documentClick)
    }
  },

  destroyed() {
    document.removeEventListener('click', this.documentClick)
    window.removeEventListener('resize', this.handleResize)
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
  h5 {
    display: inline-block;
    padding-bottom: 0;
  }
}
.navbar-items-trigger {
  display: none;
  position: relative;
  height: 56px;
  width: 20px;
  float: right;
  margin-right: 32px;
  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 19px;
  }
  .hamburger-item {
    height: 2px;
    width: 20px;
    margin: 2px 0;
    background: #000;
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
  user-select: text;
  position: absolute;
  bottom: -178px;
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
@media (max-width: 640px) {
  .navbar {
    height: unset;
    .navbar-title {
      margin-left: 32px;
      display: block;
    }

    .navbar-items {
      margin: 0;
      width: 100%;
      background: #f7f7f7;
      box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.3);

      .navbar-item {
        display: block;
        margin-left: 0;
        padding-left: 32px;
      }
    }
    .dropdown-menu {
      position: unset;
      .dropdown-item {
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 32px;
        line-height: 56px;
        font-size: 16px;
      }
    }
  }
}

@media (min-width: 641px) and (max-width: 1280px) {
  .navbar {
  }
}
</style>
