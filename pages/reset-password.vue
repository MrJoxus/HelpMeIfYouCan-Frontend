<template lang="pug">
  .reset-password
    .form-wrapper
      h1.title Passwort vergessen
      form
        input#email(type='text' name="email" placeholder="Email")
        input.button(type='submit' value='Passwort anfordern')
      div.link--small
        span Brauchst du einen Account?
          nuxt-link.primary-color(to='/register')  Registrieren
      div.link--small
        span Zurück zum
          nuxt-link.primary-color(to='/login')  Login
</template>

<script>
export default {
  layout: "with-map",
}
</script>

<style lang="scss">
.reset-password {
  .button {
    width: unset;
    margin-bottom: 16px;
  }
}
</style>
