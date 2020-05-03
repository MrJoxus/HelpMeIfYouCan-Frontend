<template lang="pug">
  .login
    .form-wrapper
      h1.title Login
      form(@submit="userLogin")
        input#email(
          v-model="login.email"
          type="text"
          name="email"
          placeholder="Email"
          @keyup="resetError('email')"
          :class='{"object--vibrate": error.email}')
        input#password(
          v-model="login.password"
          type="password"
          name="password"
          placeholder="Passwort"
          @keyup="resetError('password')"
          :class='{"object--vibrate": error.password}')
        button.button(type="submit") Login
      div.link--small
        span Brauchst du einen Account?
          nuxt-link.primary-color(to="/register")  Registrieren
      nuxt-link.link--small.primary-color(to="/reset-password") Passwort vergessen?
</template>
<script>
export default {
  layout: 'default',
  data: function() {
    return {
      login: {
        email: '',
        password: ''
      },
      error: { email: false, password: false }
    }
  },
  methods: {
    resetError(key) {
      this.error[key] = false
    },
    userLogin: function(e) {
      e.preventDefault()
      if (this.login.email == '') {
        this.error.email = true
      }
      if (this.login.password == '') {
        this.error.password = true
      }
      if (!this.error.email && !this.error.password) {
        this.$auth.loginWith('local', {
          data: this.login
        })
      }
    }
  }
}
</script>

<style lang="scss">
.login {
}
input.object--vibrate {
  border-color: red;
}
@media (max-width: 640px) {
  body {
    background: #f7f7f7;
  }
  .login {
    .form-wrapper {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      transform: unset;
      padding-top: 56px;
      box-shadow: unset;
    }
  }
}
</style>
