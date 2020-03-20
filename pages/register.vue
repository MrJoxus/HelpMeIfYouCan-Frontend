<template lang="pug">
	.container
		div
			h1.title Register
			form
				label(for='name') Vorname
				input#name(type='text')
				label(for='surname') Nachname
				input#surname(type='text')
				label(for='address') Adresse
				input#address(type='text')
				label(for='postalcode') Postleitzahl
				input#postalcode(type='text')
				label(for='area') Ort
				input#area(type='text')
				label(for='mail') Email
				input(type='text')
				label(for='password') Passwort
				input(type='password')
				label(for='password_confirmation') Passwort wiederholen
				input(type='password')
				input.button-primary(type='submit' value='Registrieren')
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  /* word-spacing: 5px; */
  padding-bottom: 15px;
}
button{
  border:none;
  margin: 0 16px;
  padding: 4px 32px;
  height: 40px;
  line-height: unset;
}
input{
	text-align: center;
}
</style>
