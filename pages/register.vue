<template lang="pug">
  .register
    .form-wrapper
      h1.title Registrieren
      form
        input#name(v-model="form.name" type='text' name="name" placeholder="Vorname")
        input#surname(v-model="form.surname" type='text' name="surname" placeholder="Nachname")
        hr
        br
        input#address(v-model="form.address" type='text' name="address" placeholder="Adresse")
        input#postalcode(v-model="form.postalcode" type='text' name="postalcode" placeholder="Postleitzahl")
        input#area(v-model="form.area" type='text' name="area" placeholder="Ort")
        hr
        br
        input#email(v-model="form.email" type='email' name="email" placeholder="Email")
        input#password(v-model="form.password" type='password' name="password" placeholder="Passwort")
        input#password-confirmation(v-model="form.passwordConfirmation" type='password' name="passwordConfirmation" placeholder="Passwort wiederholen")
        .button(@click="submitForm(form)") Registrieren
      div.link--small
        span Du hast bereits einen Account?
          nuxt-link.primary-color(to='/login')  Login
      nuxt-link.link--small.primary-color(to='/reset-password') Passwort vergessen?
</template>

<script>
export default {
  layout: 'default',
  data: function() {
    return {
      form: {
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
    submitForm: function(form) {
      console.log(form)
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
