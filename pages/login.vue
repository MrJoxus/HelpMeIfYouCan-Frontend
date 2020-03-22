<template lang="pug">
  .login
    .form-wrapper
      h1.title Login
      form
        input#email(type='text' name="email" placeholder="Email")
        input#password(type='password' name="password" placeholder="Passwort")
        input.button(type='submit' value='Login')
      div.link--small
        span Brauchst du einen Account?
          nuxt-link.primary-color(to='/register')  Registrieren
      nuxt-link.link--small.primary-color(to='/reset-password') Passwort vergessen?
</template>
<script>
export default {
  layout: 'default'
}
</script>

<style lang="scss">
.login {
}
</style>
