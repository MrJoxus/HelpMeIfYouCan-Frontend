<template lang="pug">
  .user
    .main-content
      form(@submit="sumbitUserForm")
        div.headline
          h1.title Dein Profil
          button.button.update-user(v-if="!userEdit" @click="$store.commit('user/UPDATE_USER_EDIT', true)") Profil bearbeiten
        div.user-items
          p.user-item.title Name
          p.user-item.content(v-if="!userEdit") {{ userData.name }}
          input.user-item.input(v-else v-model="userForm.user.name" type='text' name="name" :placeholder="formPlaceholer.name")
        hr
        div.user-items
          p.user-item.title Nachname
          p.user-item.content(v-if="!userEdit") {{ userData.lastName }}
          input.user-item.input(v-else v-model="userForm.user.lastName" type='text' name="lastName" :placeholder="formPlaceholer.lastName")
        hr
        div.user-items
          p.user-item.title Email
          p.user-item.content {{ userData.email }}
          //- input.user-item.input(v-else v-model="userForm.email" type='text' name="email" :placeholder="formPlaceholer.email")
        hr
        div.user-items
          p.user-item.title Adresse
          p.user-item.content(v-if="!userEdit") {{ userForm.address.street }} {{ userForm.address.houseNumber }}
          div.user-item(v-else)
            input.input.input-street(
              v-model="userForm.address.street"
              @keyup="resetAddressSearch(), resetError('street')"
              type='text'
              name="street"
              :class='{"object--vibrate": error.street}'
              :placeholder="formPlaceholer.address"
              )
            input.input.input-housenumber(
              v-model="userForm.address.houseNumber"
              @keyup="resetAddressSearch(), resetError('houseNumber')"
              :class='{"object--vibrate": error.houseNumber}'
              type='text'
              name="house number"
              placeholder="Nr"
              )
            input.input(
              v-model="userForm.address.zipCode"
              @keyup="resetAddressSearch(), resetError('zipCode')"
              :class='{"object--vibrate": error.zipCode}'
              type='text'
              name="zipCode"
              :placeholder="formPlaceholer.zipCode"
              )
            input.input(
              v-model="userForm.address.district"
              @keyup="resetAddressSearch(), resetError('district')"
              :class='{"object--vibrate": error.district}'
              type='text'
              name="area"
              :placeholder="formPlaceholer.area")
            div.search-address
              button.button(
                @click="sumbitAddressForm"
                :class='{"object--vibrate": error.noGeolocation}'
                ) Adresse verifizieren
          p.info(v-if="userEdit") * Die Adresse wird nur für die Verortung auf der Karte und für
            |  das Erstellen von neuen Anzeigen verwendet und ist eine freiwillige Angabe.
          gmaps.map-verification(v-if='windowWidth <= 1280 && userEdit')

        hr
        div.user-items
          p.user-item.title Telefon Nummer
          p.user-item.content(v-if="!userEdit") {{ userData.phoneNr }}
          input.user-item.input(v-else v-model="userForm.user.phoneNr" type='text' name="phoneNr" :placeholder="formPlaceholer.phoneNr")
          p.info(v-if="userEdit") * Deine Telefonnummer ist notwendig, damit die andere Benutzer kontaktieren können und
            |  wird natürlich erst mit deiner Zustimmung weitergegeben!
        template(v-if="userEdit")
          hr
          div.user-items
            p.user-item.title Neues Passwort
            input.user-item.input(
              v-model="userForm.password"
              type='password'
              name="password"
              :placeholder="formPlaceholer.password"
              )
        template(v-if="userEdit")
          hr
          div.user-items.password
            p.user-item.title Passwort bestätigen
            input.user-item.input(
              v-model="userForm.currentPassword"
              type='password'
              name="passwordConfirmation"
              :placeholder="formPlaceholer.currentPassword"
              :class='{"object--vibrate": error.passwordConfirmation}'
              @keyup="error.passwordConfirmation = false"
              )
        template(v-if="userEdit")
          .options
            span.left
              button.button--alert.button.delete(@click='deleteUser') Profil löschen
            .right
              button.no-button.cancel(@click="$store.commit('user/UPDATE_USER_EDIT', false), resetUserForm()") abbrechen
              button.button.update(@click="sumbitUserForm") Profil aktualisieren

</template>

<script>
import gmaps from '~/components/gmaps.vue'

export default {
  layout: 'default',
  components: { gmaps },
  ayout: 'default',
  middleware: 'auth',
  data: function() {
    return {
      windowWidth: undefined,
      userForm: {
        user: {
          name: undefined,
          lastName: undefined,
          phoneNr: undefined,
          email: undefined
        },
        address: {
          street: undefined,
          zipCode: undefined,
          district: undefined,
          houseNumber: undefined,
          coordinates: {
            latitude: undefined,
            longitude: undefined
          },
          country: 'de'
        },
        password: undefined,
        currentPassword: undefined
      },
      formPlaceholer: {
        name: 'Name',
        lastName: 'Nachname',
        address: 'Straße',
        phoneNr: 'Telefon Nummer',
        zipCode: 'Postleitzahl',
        area: 'Ort',
        email: 'Email',
        password: 'neues Passwort',
        currentPassword: 'Passwort bestätigen'
      },
      error: {
        noGeolocation: false,
        phoneNr: false,
        passwordConfirmation: false,
        street: false,
        zipCode: false,
        district: false,
        houseNumber: false
      }
    }
  },
  methods: {
    deleteUser(e) {
      e.preventDefault()
      let firstConfirmation = confirm('Möchtest du dein Profil löschen?')
      if (firstConfirmation) {
        let secondConfirmation = confirm(
          'Dieser Vorgang ist kann nicht rückgängig gemacht werden. Benutzer löschen?'
        )
        if (secondConfirmation) {
          // key validation currendPassword
          if (
            this.userForm.currentPassword != '' &&
            this.userForm.currentPassword != undefined &&
            this.userForm.currentPassword != null
          ) {
            this.$axios
              .delete('api/user/me', {
                passwordConfirmation: this.userForm.currentPassword
              })
              .then(response => {
                console.log('response', response)
                localStorage.removeItem('auth._token.local')
                document.cookie =
                  'auth._token.local=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

                self.$router.push('/')
              })
              .catch(error => {
                console.log('error', error)
              })
          } else {
            // error passwordConfirmation is missing
            this.error.passwordConfirmation = false
            setTimeout(() => {
              this.error.passwordConfirmation = true
            }, 0)
            return
          }
        }
      }
    },
    resetAddressSearch: function() {
      this.resetError('noGeolocation')
      this.userForm.address.coordinates = {
        latitude: undefined,
        longitude: undefined
      }
    },
    resetError(key) {
      this.error[key] = false
    },
    sumbitUserForm: function(e) {
      e.preventDefault()
      let payload = { user: {}, address: {} }

      // key validation user
      for (let key in this.userForm.user) {
        let value = this.validate(key, this.userForm.user[key])
        if (value != null) {
          payload.user[key] = value
        }
        delete payload.user.email
      }

      // key validation address
      for (let key in this.userForm.address) {
        let value = this.validate(key, this.userForm.address[key])
        if (value != null && value != '') {
          payload.address[key] = value
        }
      }

      // no input
      if (Object.keys(payload.address).length == 2) {
        if (
          this.userData.fullAddress == null &&
          !this.userForm.address.coordinates.latitude
        ) {
          payload.address = {}
        }
      }
      // input
      else if (Object.keys(payload.address).length >= 3) {
        if (!this.userForm.address.coordinates.latitude) {
          this.error.noGeolocation = false
          setTimeout(() => {
            this.error.noGeolocation = true
          }, 0)
          return
        }
      }

      // key validation password
      if (
        this.userForm.password != '' &&
        this.userForm.password != undefined &&
        this.userForm.password != null
      ) {
        payload.user.password = this.userForm.password
      }

      // key validation currendPassword
      if (
        this.userForm.currentPassword != '' &&
        this.userForm.currentPassword != undefined &&
        this.userForm.currentPassword != null
      ) {
        payload.currentPassword = this.userForm.currentPassword
        this.$store.dispatch('user/UPDATE_USER', payload)
      } else {
        // error passwordConfirmation is missing
        this.error.passwordConfirmation = false
        setTimeout(() => {
          this.error.passwordConfirmation = true
        }, 0)
        return
      }
    },

    validate: function(key, item) {
      if (item != undefined && item != null && item != '') {
        return item
      } else {
        return null
      }
    },

    sumbitAddressForm: function(e) {
      e.preventDefault()

      let payload = {}

      for (let key in this.userForm.address) {
        let value = this.validate(key, this.userForm.address[key])
        if (value != null && value != '') {
          payload[key] = value
        }
      }
      let keys = Object.keys(payload)
      if (keys.length < 6) {
        if (!keys.includes('street')) {
          this.error.street = true
        }
        if (!keys.includes('zipCode')) {
          this.error.zipCode = true
        }
        if (!keys.includes('district')) {
          this.error.district = true
        }
        if (!keys.includes('houseNumber')) {
          this.error.houseNumber = true
        }
      } else {
        e.preventDefault()
        this.$store.dispatch('gmaps/GET_GEOLOCATION', {
          address: this.userForm.address,
          type: 'userLocation'
        })
      }
    },
    setUserForm: function() {
      this.userForm.user.name = this.userData.name
      this.userForm.user.lastName = this.userData.lastName
      this.userForm.user.phoneNr = this.userData.phoneNr
      this.userForm.user.email = this.userData.email

      if (this.userData.fullAddress != null) {
        this.userForm.address.street = this.userData.fullAddress.street
        this.userForm.address.zipCode = this.userData.fullAddress.zipCode
        this.userForm.address.district = this.userData.fullAddress.district
        this.userForm.address.houseNumber = this.userData.fullAddress.houseNumber
      }
    },
    resetUserForm() {
      this.userForm.user.name = this.userData.name
      this.userForm.user.lastName = this.userData.lastName
      this.userForm.user.phoneNr = this.userData.phoneNr
      this.userForm.user.email = this.userData.email
      this.userForm.password = ''
      this.userForm.currentPassword = ''

      if (this.userData.fullAddress != null) {
        this.userForm.address.street = this.userData.fullAddress.street
        this.userForm.address.zipCode = this.userData.fullAddress.zipCode
        this.userForm.address.district = this.userData.fullAddress.district
        this.userForm.address.houseNumber = this.userData.fullAddress.houseNumber
      } else {
        this.userForm.address.street = ''
        this.userForm.address.zipCode = ''
        this.userForm.address.district = ''
        this.userForm.address.houseNumber = ''
      }
    },
    onResize() {
      this.windowWidth = window.innerWidth
    }
  },
  computed: {
    userData() {
      return this.$store.state.user.data
    },
    userEdit() {
      return this.$store.state.user.edit
    },
    userLocation() {
      return this.$store.state.gmaps.userLocation
    }
  },
  watch: {
    userData() {
      this.setUserForm()
    },
    userEdit() {
      if (this.userEdit) this.setUserForm()
    },
    userLocation() {
      this.userForm.address.coordinates = {
        latitude: this.userLocation.lat,
        longitude: this.userLocation.lng
      }
    }
  },
  mounted() {
    this.$store.commit('gmaps/UPDATE_STATUS', {
      show: { filter: false, markers: false }
    })
    this.$store.commit('gmaps/INCREMENT_CENTER_TRIGGER')
    this.setUserForm()
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style lang="scss">
.user {
  .main-content {
    position: absolute;
    top: calc(56px + 56px);
    left: 56px;
    z-index: 100;
    width: 640px;
    margin: 0 auto;
    padding: 40px;
    background: #f7f7f7;
    box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
    h1 {
      text-align: left;
    }
    .headline {
      position: relative;
    }
    .update-user {
      position: absolute;
      top: 0;
      right: 0;
      margin-right: 0;
    }
    .user-items {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .info {
        font-size: 10px;
      }
      &.password {
        input.object--vibrate {
          border-color: red;
        }
      }
    }
    .user-item {
      width: 50%;
      margin-bottom: 16px;
      margin-top: 16px;
      &.title {
        // font-size: 12px;
        padding-bottom: 0px;
      }
      &.content {
        padding-bottom: 0;
      }
      &.input {
        margin-bottom: 8px;
        margin-top: 8px;
      }
      .input-street {
        display: inline-block;
        width: 70%;
      }
      .input-housenumber {
        display: inline-block;
        width: 25%;
        float: right;
      }
      input.object--vibrate {
        border-color: red;
      }

      .search-address {
        display: block;
        height: 16px;
        button {
          margin-right: 0;
          margin-bottom: 0;
          float: right;
          cursor: pointer;
          transition: all 0.1s ease;
        }
        .object--vibrate {
          border-color: red;
          background: red;
          &:hover {
            color: white;
          }
        }
        .button-wrapper {
          height: 48px;
          text-align: right;
          a {
            font-size: 13.33px;
            margin-right: 0;
          }
        }
      }
    }
  }
  .options {
    margin-top: 24px;
    button {
      margin-bottom: 0;
    }
    .left {
      .button {
        margin-left: 0;
      }
    }
    .right {
      float: right;
      .button {
        margin-right: 0;
      }
    }
    .cancel {
      margin-right: 12px;
      cursor: pointer;
    }
    hr {
      margin-left: -40px;
      margin-right: -40px;
    }
  }
  .button {
    padding-right: 24px;
    padding-left: 24px;
  }
  hr {
    border-top: solid 0.5px #919191;
    border-bottom: solid 0.5px #919191;
    margin-top: 4px;
    margin-bottom: 4px;
  }
}

@media (max-width: 1280px) {
  .user {
    .main-content {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      padding: 24px;
      transform: unset;
      padding-top: 56px;
      box-shadow: unset;
      .user-items {
        display: block;
      }
      .map-verification {
        position: static;
        width: 100%;
        height: 240px;
        margin-bottom: 32px;
      }
      .user-item {
        width: 100%;
        &.title {
          font-size: 14px;
          margin-bottom: 8px;
        }
        &.content {
          margin-top: 8px;
        }
        &.input {
          margin-bottom: 16px;
        }
        .search-address {
          height: 48px;
        }
      }
      .update-user {
        position: relative;
      }
      .options {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        .left {
          margin-top: 32px;
          width: 100%;
          order: 1;
          button {
            float: right;
            margin-right: 0;
          }
        }
        .right {
          float: unset;
          order: 0;
        }
      }
    }
  }
}
@media (min-width: 641px) and (max-width: 1280px) {
  .user {
    .main-content {
      width: 640px;
    }
  }
}
</style>
