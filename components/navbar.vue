<template lang='pug'>
  .navbar(ref='navbar')
    .navbar-title
      nuxt-link(to='/')
        h5 Help Me If You Can!
    .navbar-items
      nuxt-link.navbar-item(to='/create?type=help-offer')
        img(src="../assets/img/add.png")
      nuxt-link.navbar-item(to='/map' v-if='$auth.loggedIn') Karte
      nuxt-link.navbar-item(to='/about-us') Über uns
      nuxt-link.navbar-item(to='/impressum') Impressum
      template(v-if='$auth.loggedIn')
        nuxt-link.navbar-item.with-img(to='/user/inbox')
          img(src="~/assets/img/mail.png")
          .counter(v-if='this.counter > 0') {{ this.counter }}
        span.navbar-item.dropdown-trigger(
          @click='toggleProfileDropdown()'
          ref='parentDropdownMenu'
          ) {{ $auth.user }}
      template(v-else)
        nuxt-link.navbar-item(to='/login') Login
        nuxt-link.navbar-item(to='/register') Registrieren

      //- dropdown
      template(v-if='$auth.loggedIn')
        transition(name='fade')
          div.dropdown-menu(v-show='dropdown' ref='dropdownMenu')
            div.dropdown-item.profil-info
              p {{user.name}} {{user.lastName}}
              p {{user.email}}
            hr
            nuxt-link.dropdown-item.profile(
              @click.native='toggleProfileDropdown()'
              to='/user-applications'
              ) Meine Anzeigen
            hr
            nuxt-link.dropdown-item.profile(
              @click.native='toggleProfileDropdown()'
              to='/user'
              ) Zum Profil
            hr
            p.dropdown-item.logout(@click='toggleProfileDropdown(), logout()') Abmelden

    div.navbar-items-trigger(@click="toggleNavbbarItems()")
      .hamburger
        div.hamburger-item
        div.hamburger-item
        div.hamburger-item
    transition(name='fade')
      .navbar-items-mobile(
        @click='navbarItemsMobile = !navbarItemsMobile'
        v-show='navbarItemsMobile'
        )
        nuxt-link.navbar-item.with-img(to='/create' v-if='$auth.loggedIn')
          span Neue Anzeige
          .navbar-item-img
            img(src="../assets/img/add.png")
        nuxt-link.navbar-item(to='/map' v-if='$auth.loggedIn') Zur Karte
        nuxt-link.navbar-item(to='/about-us') Über uns
        nuxt-link.navbar-item(to='/impressum') Impressum
        template(v-if='!$auth.loggedIn')
          nuxt-link.navbar-item(to='/login') Login
          nuxt-link.navbar-item(to='/register') Registrieren
        template(v-if='$auth.loggedIn' )
          hr
          nuxt-link.navbar-item.with-img(
            v-if='$auth.loggedIn'
            to='/user/inbox'
            )
            span Nachrichten
            .navbar-item-img
              img(src="~/assets/img/mail.png")
              .counter(v-if='this.counter > 0') {{ this.counter }}
          nuxt-link.navbar-item(to='/user-applications') Meine Anzeigen
          nuxt-link.navbar-item(to='/user') Zum Profil
          p.navbar-item(@click="logout()") Abmelden
</template>

<script>
export default {
  data: function() {
    return {
      dropdown: false,
      navbarItemsMobile: false,
      navbarItems: true,
      window: {
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        width: 0,
        height: 0
      },
      counter: 0
    }
  },

  methods: {
    toggleProfileDropdown: function() {
      this.dropdown = !this.dropdown
    },
    toggleNavbbarItems: function() {
      this.navbarItemsMobile = !this.navbarItemsMobile
      if (this.navbarItemsMobile == true) {
        setTimeout(() => {
          document.addEventListener('click', this.closeMobileDropdown)
        }, 1)
      }
    },
    closeMobileDropdown: function(e) {
      document.removeEventListener('click', this.closeMobileDropdown)
      this.navbarItemsMobile = false
    },
    closeProfileDropdown(e) {
      let el = this.$refs.dropdownMenu
      let target = e.target
      let parent = this.$refs.parentDropdownMenu
      if (el !== target && parent !== target && !el.contains(target)) {
        this.dropdown = false
      }
    },
    logout() {
      localStorage.removeItem('auth._token.local')
      document.cookie =
        'auth._token.local=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      window.location.reload(true)
    }
  },
  computed: {
    user() {
      return this.$store.state.user.data
    }
  },
  watch: {
    user() {
      let counter = 0
      this.user.applications.received.forEach(application => {
        if (!application.read) counter++
      })
      this.user.acceptedApplications.received.forEach(application => {
        if (!application.read) counter++
      })
      this.counter = counter
    }
  },
  mounted() {
    if (this.$store.state.auth.loggedIn) {
      document.addEventListener('click', this.closeProfileDropdown)
    }
  },
  destroyed() {
    document.removeEventListener('click', this.closeProfileDropdown)
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
.navbar-items {
  float: right;
  margin-right: $navbar-height;
}
.navbar-item {
  position: relative;
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
  img {
    margin-top: -2px;
    vertical-align: middle;
  }
  &.with-img {
    position: relative;
    .counter {
      position: absolute;
      top: 8px;
      right: -8px;
      height: 16px;
      min-width: 16px;
      padding: 0 2px;
      font-size: 13px;
      line-height: 16px;
      text-align: center;
      background: red;
      color: white;
      border-radius: 8px;
    }
  }
}
.user-name {
  position: relative;
}
.dropdown-menu {
  user-select: text;
  position: absolute;
  bottom: -212px;
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
    cursor: pointer;
  }
  .hamburger-item {
    height: 2px;
    width: 20px;
    margin: 2px 0;
    background: #000;
  }
}
.navbar-items-mobile {
  margin-top: -1px;
  background: #f7f7f7;
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.3);

  .navbar-item {
    display: block;
  }
}

@media (max-width: 640px) {
  .navbar-items-trigger {
    display: block;
  }
  .navbar-items {
    display: none;
  }
  .navbar-title {
    margin-left: 32px;
  }
  .with-img {
    span {
      margin-right: 16px;
    }
    .navbar-item-img {
      display: inline-block;
      position: relative;
    }
  }
}

@media (min-width: 641px) {
  .navbar-items-mobile {
    display: none;
  }
}
</style>
