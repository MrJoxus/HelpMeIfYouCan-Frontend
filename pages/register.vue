<template lang="pug">
  .register
    .form-wrapper
      h1.title Registrieren
      form(@submit="submitForm")
        input#name(v-model="register.name" type='text' name="name" placeholder="Vorname")
        input#lastName(v-model="register.lastName" type='text' name="lastName" placeholder="Nachname")
        input#phoneNr(v-model="register.phoneNr" type='text' name="lastName" placeholder="Telefonnummer")
        hr
        br
        //- input#address(v-model="register.address" type='text' name="address" placeholder="Adresse")
        //- input#postalcode(v-model="register.postalcode" type='text' name="postalcode" placeholder="Postleitzahl")
        //- input#area(v-model="register.area" type='text' name="area" placeholder="Ort")
        //- hr
        //- br
        input#email(v-model="register.email" type='email' name="email" placeholder="Email")
        input#password(v-model="register.password" type='password' name="password" placeholder="Passwort")
        input#password-confirmation(v-model="register.passwordConfirmation" type='password' name="passwordConfirmation" placeholder="Passwort wiederholen")
        p.error(v-if='error') Passwörter stimmen nicht überein.
        button.button(type="submit") Registrieren
      div.link--small
        span Du hast bereits einen Account?
          nuxt-link.primary-color(to='/login')  Login
      nuxt-link.link--small.primary-color(to='/reset-password') Passwort vergessen?
</template>

<script>
export default {
  layout: 'with-map',
  data: function() {
    return {
      error: false,
      register: {
        name: 'Joachim',
        lastName: 'Kiedrowski',
        address: '',
        phoneNr: 123456789,
        postalcode: '',
        area: '',
        email: 'qwertz@mail.com',
        password: 'asdf',
        passwordConfirmation: 'asdf'
      }
    }
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault()
      this.validatePassword()

      if (!this.error) {
        let self = this
        this.$axios
          .post('/auth/signup', {
            email: self.register.email,
            password: self.register.password,
            phoneNr: self.register.phoneNr,
            name: self.register.name,
            lastName: self.register.lastName
          })
          .then(response => {
            self.$router.push('login')
          })
          .catch(error => {
            console.log('error', error)
          })
      }
    },
    validatePassword: function() {
      this.error =
        this.register.password != this.register.passwordConfirmation
          ? true
          : false
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
