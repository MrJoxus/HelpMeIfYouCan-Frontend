<template lang="pug">
  .register
    .form-wrapper
      h1.title Registrieren
      form(@submit="submitForm")
        input#name(v-model="register.name" type='text' name="name" placeholder="Vorname")
        input#surname(v-model="register.surname" type='text' name="surname" placeholder="Nachname")
        hr
        br
        input#address(v-model="register.address" type='text' name="address" placeholder="Adresse")
        input#postalcode(v-model="register.postalcode" type='text' name="postalcode" placeholder="Postleitzahl")
        input#area(v-model="register.area" type='text' name="area" placeholder="Ort")
        hr
        br
        input#email(v-model="register.email" type='email' name="email" placeholder="Email")
        input#password(v-model="register.password" type='password' name="password" placeholder="Passwort")
        input#password-confirmation(v-model="register.passwordConfirmation" type='password' name="passwordConfirmation" placeholder="Passwort wiederholen")
        button.button(type="submit") Registrieren
      div.link--small
        span Du hast bereits einen Account?
          nuxt-link.primary-color(to='/login')  Login
      nuxt-link.link--small.primary-color(to='/reset-password') Passwort vergessen?
</template>

<script>
export default {
  layout: "with-map",
  data: function() {
    return {
      register: {
        name: '',
        surname: '',
        address: '',
        postalcode: '',
        area: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      }
    }
  },
  methods: {
    submitForm: function(e) {
      this.$auth.loginWith('local', {})
      e.preventDefault()
      console.log(this.register)
    }
  }
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
