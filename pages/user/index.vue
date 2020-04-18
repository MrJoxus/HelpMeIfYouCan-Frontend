<template lang="pug">
  .user
    .main-content
      form(@submit="sumbitUserForm")
        div.headline
          h1.title Dein Profil
          p(v-if="error.status") ERROR: {{ error.status}}
          button.button.update-user(v-if="!userEdit" @click="$store.commit('user/TOGGLE_USER_EDIT')") Profil bearbeiten
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
          p.user-item.content(v-if="!userEdit") {{ userData.addresse }}
          div.user-item(v-else)
            input.input.input-street(
              v-model="userForm.address.street"
              @keyup="toggleAddresSearch()"
              type='text'
              name="address"
              :placeholder="formPlaceholer.address"
              )
            input.input.input-housenumber(
              v-model="userForm.address.houseNumber"
              @keyup="toggleAddresSearch()"
              type='text'
              name="address"
              placeholder="Nr"
              )
            input.input(
              v-model="userForm.address.zipCode"
              @keyup="toggleAddresSearch()"
              type='text'
              name="postalCode"
              :placeholder="formPlaceholer.postalCode"
              )
            input.input(
              v-model="userForm.address.district"
              @keyup="toggleAddresSearch()"
              type='text'
              name="area"
              :placeholder="formPlaceholer.area")
            div.search-address(v-if="searchAddress.button")
              button.no-button(@click="sumbitAddressForm") Adresse suchen
        hr
        div.user-items
          p.user-item.title Telefon Nummer
          p.user-item.content(v-if="!userEdit") {{ userData.phoneNr }}
          input.user-item.input(v-else v-model="userForm.user.phoneNr" type='text' name="phoneNr" :placeholder="formPlaceholer.phoneNr")
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
          div.user-items
            p.user-item.title Passwort bestätigen
            input.user-item.input(
              v-model="userForm.currentPassword"
              type='password'
              name="passwordConfirmation"
              :placeholder="formPlaceholer.currentPassword"
              )
        template(v-if="userEdit")
          .options
            span.left
              button.button--alert.button.delete Profil löschen
            .right
              button.no-button.cancel(@click="$store.commit('user/TOGGLE_USER_EDIT')") abbrechen
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
          houseNumber: ''
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
      }
    }
  },
  methods: {
    toggleAddresSearch: function() {
      if (
        this.userForm.address.street &&
        this.userForm.address.zipCode &&
        this.userForm.address.district &&
        this.userForm.address.houseNumber
      ) {
        this.$store.commit('user/UPDATE_ADDRES_SEARCH', { button: true })
      } else {
        this.$store.commit('user/UPDATE_ADDRES_SEARCH', { button: false })
      }
    },
    sumbitUserForm: function(e) {
      e.preventDefault()
      let payload = { user: {}, address: {} }
      let form = this.userForm
      for (let key in form.user) {
        let value = this.validateUserForm(key, form.user[key])
        if (value != null) {
          payload.user[key] = value
        }
        delete payload.user.email
      }
      for (let key in form.address) {
        let value = this.validateAddressForm(key, form.address[key])
        if (value != null && value != '') {
          payload.address[key] = value
        }
      }
      if (
        form.password != '' &&
        form.password != undefined &&
        form.password != null
      ) {
        payload.user.password = form.password
      }
      if (form.currentPassword != '') {
        payload.currentPassword = form.currentPassword
      }
      this.$store.dispatch('user/UPDATE_USER', payload)
    },
    validateUserForm: function(key, item) {
      if (item != this.userData[key] && item != undefined && item != null) {
        return item
      } else {
        return null
      }
    },
    validateAddressForm: function(key, item) {
      if (
        item != this.userData.fullAddress[key] &&
        item != undefined &&
        item != null
      ) {
        return item
      } else {
        return null
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
    sumbitAddressForm: function(e) {
      e.preventDefault()
      this.$store.dispatch('gmaps/GET_GEOLOCATION', {
        street: this.userForm.address.street,
        houseNumber: this.userForm.address.houseNumber,
        postlCode: this.userForm.address.postalCode,
        area: this.userForm.address.area
      })
    }
  },
  computed: {
    userData() {
      return this.$store.state.user.data
    },
    userEdit() {
      return this.$store.state.user.edit
    },
    searchAddress() {
      return this.$store.state.user.addresSearch
    },
    error() {
      return this.$store.state.user.error
    },
    ownLocation() {
      return this.$store.state.gmaps.ownLocation
    }
  },
  watch: {
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
          float: right;
          cursor: pointer;
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
