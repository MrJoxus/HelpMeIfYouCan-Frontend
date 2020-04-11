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
          input.user-item.input(v-else v-model="userForm.name" type='text' name="name" :placeholder="formPlaceholer.name")
        hr
        div.user-items
          p.user-item.title Nachname
          p.user-item.content(v-if="!userEdit") {{ userData.lastName }}
          input.user-item.input(v-else v-model="userForm.lastName" type='text' name="lastName" :placeholder="formPlaceholer.lastName")
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
            input.input(
              v-model="userForm.address"
              @keyup="toggleAddresSearch()"
              type='text'
              name="address"
              :placeholder="formPlaceholer.address"
              )
            input.input(
              v-model="userForm.postalCode"
              @keyup="toggleAddresSearch()"
              type='text'
              name="postalCode"
              :placeholder="formPlaceholer.postalCode"
              )
            input.input(
              v-model="userForm.area"
              @keyup="toggleAddresSearch()"
              type='text'
              name="area"
              :placeholder="formPlaceholer.area")
            button.no-button.search-address(v-if="searchAddress.button" @click="sumbitAddressForm()") Adresse suchen

        hr
        div.user-items
          p.user-item.title Telefon Nummer
          p.user-item.content(v-if="!userEdit") {{ userData.phoneNr }}
          input.user-item.input(v-else v-model="userForm.phoneNr" type='text' name="phoneNr" :placeholder="formPlaceholer.phoneNr")
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
        name: '',
        lastName: '',
        address: '',
        phoneNr: '',
        postalCode: '',
        area: '',
        email: '',
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
        this.userForm.address &&
        this.userForm.postalCode &&
        this.userForm.area
      ) {
        this.$store.commit('user/UPDATE_ADDRES_SEARCH', { button: true })
      } else {
        this.$store.commit('user/UPDATE_ADDRES_SEARCH', { button: false })
      }
    },
    sumbitUserForm: function(e) {
      e.preventDefault()
      let payload = {}
      for (let item in this.userForm) {
        if (
          this.userForm[item] != this.userData[item] &&
          this.userForm[item] != undefined &&
          this.userForm[item] != null
        ) {
          payload[item] = this.userForm[item]
        }
      }
      if (
        this.userForm.password == '' ||
        this.userForm.password == undefined ||
        this.userForm.password == null
      ) {
        delete payload.password
      }
      this.$store.dispatch('user/UPDATE_USER', payload)
    },
    setUserForm: function() {
      this.userForm.name = this.userData.name
      this.userForm.lastName = this.userData.lastName
      this.userForm.address = this.userData.address
      this.userForm.postalCode = this.userData.postalCode
      this.userForm.area = this.userData.area
      this.userForm.phoneNr = this.userData.phoneNr
      this.userForm.email = this.userData.email
    },
    sumbitAddressForm: function() {
      this.$store.dispatch('gmaps/GET_GEOLOCATION', {
        street: this.userForm.address,
        postlCode: this.userForm.postalCode,
        area: this.userForm.area
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
    }
  },
  watch: {
    userEdit() {
      if (this.userEdit) this.setUserForm()
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
      .search-address {
        float: right;
        cursor: pointer;
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
