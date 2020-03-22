<template lang="pug">
  .register
    .form-wrapper
      h1.title Registrieren
      form
        input#name(type='text' name="name" placeholder="Vorname")
        input#surname.pseudo-class(type='text' name="surname" placeholder="Nachname")
        hr
        br
        input#address(type='text' name="address" placeholder="Adresse")
        input#postalcode(type='text' name="postalcode" placeholder="Postleitzahl")
        input#area(type='text' name="area" placeholder="Ort")
        hr
        br
        input#email(type='email' name="email" placeholder="Email")
        input#password(type='password' name="password" placeholder="Passwort")
        input#password-confirmation(type='password' name="passwordConfirmation" placeholder="Passwort wiederholen")
        input.button(type='submit' value='Registrieren')
      div.link--small
        span Du hast bereits einen Account?
          nuxt-link.primary-color(to='/login')  Login
      nuxt-link.link--small.primary-color(to='/reset-password') Passwort vergessen?
</template>

<script>
export default {
  layout: 'default'
}
</script>

<style lang="scss">
.register {
  .button {
    width: 200px;
  }
  hr {
    border-top: solid 1px #919191;
    // border-top: 1px solid red;
  }
}
</style>
