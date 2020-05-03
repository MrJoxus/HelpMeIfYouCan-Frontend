<template lang='pug'>
  .register
    .form-wrapper
      h1.title Registrieren
      form(@submit='submitForm')
        input#name(
          v-model='register.name'
          type='text'
          name='name'
          placeholder='Vorname'
          @keyup="resetError('name')"
          :class='{"object--vibrate": error.name}')
        input#lastName(
          v-model='register.lastName'
          type='text'
          name='lastName'
          placeholder='Nachname'
          @keyup="resetError('lastName')"
          :class='{"object--vibrate": error.lastName}')
        input#phoneNr(
          v-model='register.phoneNr'
          type='text'
          name='lastName'
          placeholder='Telefonnummer'
          @keyup="resetError('phoneNr')"
          :class='{"object--vibrate": error.phoneNr}')
        hr
        br
        input#email(
          v-model='register.email'
          type='email'
          name='email'
          placeholder='Email'
          @keyup="resetError('email')"
          :class='{"object--vibrate": error.email}')
        input#password(
          v-model='register.password'
          type='password'
          name='password'
          placeholder='Passwort'
          @keyup="resetError('password')"
          :class='{"object--vibrate": error.password}')
        input#password-confirmation(
          v-model='register.passwordConfirmation'
          type='password'
          name='passwordConfirmation'
          placeholder='Passwort wiederholen'
          @keyup="resetError('passwordConfirmation')"
          :class='{"object--vibrate": error.passwordConfirmation}')
        p.error(v-if='error.passwordsMatch') Passwörter stimmen nicht überein.
        button.button(type='submit') Registrieren
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
      error: {
        name: false,
        lastName: false,
        phoneNr: false,
        email: false,
        password: false,
        passwordConfirmation: false,
        passwordsMatch: false
      },
      register: {
        name: '',
        lastName: '',
        phoneNr: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      }
    }
  },
  methods: {
    resetError(key) {
      this.error[key] = false
    },
    submitForm: function(e) {
      e.preventDefault()
      let validForm = true
      if (this.register.password != this.register.passwordConfirmation) {
        this.error.password = true
        this.error.passwordConfirmation = true
        this.error.passwordsMatch = true
      }
      for (let key in this.register) {
        if (this.register[key] == '') {
          this.error[key] = true
          validForm = false
        }
      }

      if (validForm) {
        let self = this
        this.$axios
          .post('/api/auth/register', {
            email: self.register.email,
            password: self.register.password,
            name: self.register.name,
            lastName: self.register.lastName,
            phoneNr: self.register.phoneNr
          })
          .then(response => {
            self.$router.push('login')
          })
          .catch(error => {
            console.log('error', error)
            this.$store.dispatch('modal/FLASH_MODAL', 'cancel')
          })
      }
    }
  }
}
</script>

<style lang='scss'>
.register {
  .button {
    width: 200px;
  }
  hr {
    border-top: solid 1px #919191;
  }
}
@media (max-width: 1367px) {
  body {
    background: #f7f7f7;
  }
  .register {
    .form-wrapper {
      position: relative;
      top: 0;
      left: 0;
      width: 640px;
      margin: 0 auto;
      transform: unset;
      padding-top: 40px;
      box-shadow: unset;
    }
  }
}
@media (max-width: 640px) {
  .register {
    .form-wrapper {
      width: 100%;
    }
  }
}
</style>
