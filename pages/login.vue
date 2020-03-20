<template lang="pug">
	.container
		div
			h1.title Login
			form
				label(for='email') Email
				input(type='text')
				label(for='password') Passwort
				input(type='password')
				input.button-primary(type='submit' value='Login')
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
	max-width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
	div{
		width: 100%;
	}
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
form{
	width: 100%;
}
input{
	text-align: center;
}
</style>