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
              @keyup="resetAddressSearch()"
              type='text'
              name="address"
              :placeholder="formPlaceholer.address"
              )
            input.input.input-housenumber(
              v-model="userForm.address.houseNumber"
              type='text'
              name="house number"
              placeholder="Nr"
              )
            input.input(
              v-model="userForm.address.zipCode"
              @keyup="resetAddressSearch()"
              type='text'
              name="postalCode"
              :placeholder="formPlaceholer.postalCode"
              )
            input.input(
              v-model="userForm.address.district"
              @keyup="resetAddressSearch()"
              type='text'
              name="area"
              :placeholder="formPlaceholer.area")
            div.search-address
              button.button(
                @click="sumbitAddressForm"
                :class='{"object--vibrate": error.noGeolocation}'
                ) Adresse verifizieren
        hr
        div.user-items
          p.user-item.title(v-if="!userEdit") Telefon Nummer
          p.user-item.title(v-if="userEdit") Telefon Nummer *
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
              button.button--alert.button.delete Profil löschen
            .right
              button.no-button.cancel(@click="$store.commit('user/UPDATE_USER_EDIT', false), resetuserForm()") abbrechen
              button.button.update(@click="sumbitUserForm") Profil aktualisieren

</template>

<script>
export default {
  layout: 'with-map',
  middleware: 'auth',
  data: function() {
    return {
      userForm: {
        user: {
          name: '',
          lastName: '',
          phoneNr: '',
          email: ''
        },
        address: {
          street: '',
          zipCode: '',
          district: '',
          houseNumber: '',
          coordinates: {
            latitude: undefined,
            longitude: undefined
          }
        },
        password: '',
        currentPassword: ''
      },
      formPlaceholer: {
        name: 'Name',
        lastName: 'Nachname',
        address: 'Straße',
        phoneNr: 'Telefon Nummer',
        postalCode: 'Postleitzahl',
        area: 'Ort',
        email: 'Email',
        password: 'neues Passwort',
        currentPassword: 'Passwort bestätigen'
      },
      error: {
        noGeolocation: false,
        phoneNr: false,
        passwordConfirmation: false
      }
    }
  },
  methods: {
    resetAddressSearch: function() {
      this.error.noGeolocation = false
      this.userForm.address.coordinates = {
        latitude: undefined,
        longitude: undefined
      }
    },
    sumbitUserForm: function(e) {
      e.preventDefault()
      let payload = { user: {}, address: {} }

      // key validation user
      for (let key in this.userForm.user) {
        let value = this.validateUserForm(key, this.userForm.user[key])
        if (value != null) {
          payload.user[key] = value
        }
        delete payload.user.email
      }

      // key validation address
      for (let key in this.userForm.address) {
        let value = this.validateAddressForm(key, this.userForm.address[key])
        if (value != null && value != '') {
          payload.address[key] = value
        }
      }

      // error if new address and geolocation missing
      let testAddress = payload.address
      delete testAddress.coordinates
      if (Object.keys(testAddress).length != 0) {
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

    validateUserForm: function(key, item) {
      if (item != this.userData[key] && item != undefined && item != null) {
        return item
      } else {
        return null
      }
    },
    validateAddressForm: function(key, item) {
      if (this.userData.fullAddress && item == this.userData.fullAddress[key]) {
        return null
      }
      if (item != undefined && item != null) {
        return item
      } else {
        return null
      }
    },
    sumbitAddressForm: function(e) {
      e.preventDefault()
      this.$store.dispatch('gmaps/GET_GEOLOCATION', this.userForm.address)
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
    resetuserForm() {
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
    }
  },
  computed: {
    userData() {
      return this.$store.state.user.data
    },
    userEdit() {
      return this.$store.state.user.edit
    },
    ownLocation() {
      return this.$store.state.gmaps.ownLocation
    }
  },
  watch: {
    userData() {
      this.setUserForm()
    },
    userEdit() {
      if (this.userEdit) this.setUserForm()
    },
    ownLocation() {
      this.userForm.address.coordinates = {
        latitude: this.ownLocation.lat,
        longitude: this.ownLocation.lng
      }
    }
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
@media (max-width: 640px) {
  .user {
    .main-content {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      transform: unset;
      padding-top: 56px;
      .user-items {
        display: block;
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
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

@media (max-width: 1281px) {
}
</style>
