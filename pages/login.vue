<template lang="pug">
  .login
    .form-wrapper
      h1.title Login
      form(@submit="userLogin")
        input#email(v-model="login.email" type="text" name="email" placeholder="Email")
        input#password(v-model="login.password" type="password" name="password" placeholder="Passwort")
        button.button(type="submit") Login
      div.link--small
        span Brauchst du einen Account?
          nuxt-link.primary-color(to="/register")  Registrieren
      nuxt-link.link--small.primary-color(to="/reset-password") Passwort vergessen?
</template>
<script>
export default {
  layout: 'with-map',
  data: function() {
    return {
      login: {
        email: 'qwertz@mail.com',
        password: 'asdfasdf1'
      }
    }
  },
  methods: {
    userLogin: function(e) {
      e.preventDefault()
      this.$auth.loginWith('local', {
        data: this.login
      })
    }
  }
}
</script>

<style lang="scss">
.login {
}
</style>
