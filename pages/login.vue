<template lang="pug">
  .login
    .form-wrapper
      h1.title Login
      form
        input#email(v-model="form.email" type='text' name="email" placeholder="Email")
        input#password(v-model="form.password" type='password' name="password" placeholder="Passwort")
        .button(@click="submitForm(form)") Login
      div.link--small
        span Brauchst du einen Account?
          nuxt-link.primary-color(to='/register')  Registrieren
      nuxt-link.link--small.primary-color(to='/reset-password') Passwort vergessen?
</template>
<script>
export default {
  layout: 'default',
  data: function() {
    return {
      form: {
        email: '',
        password: '',
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
.login {
}
</style>
