<template lang="pug">
  .user
    .main-content
      div.headline
        h1.title Dein Profil
        button.button.update-user(v-if="!editUserActive" @click="toggleUserEdit()") Profil bearbeiten
      div.user-items
        p.user-item.title Name
        p.user-item.content(v-if="!editUserActive") {{ user.name }}
        input.user-item.input(v-else v-model="userForm.name" type='text' name="name" :placeholder="formPlaceholer.name")
      hr
      div.user-items
        p.user-item.title Nachname
        p.user-item.content(v-if="!editUserActive") {{ user.lastName }}
        input.user-item.input(v-else v-model="userForm.lastName" type='text' name="lastName" :placeholder="formPlaceholer.lastName")
      hr
      div.user-items
        p.user-item.title Email
        p.user-item.content(v-if="!editUserActive") {{ user.email }}
        input.user-item.input(v-else v-model="userForm.email" type='text' name="email" :placeholder="formPlaceholer.email")
      hr
      div.user-items
        p.user-item.title Adresse
        p.user-item.content(v-if="!editUserActive") {{ user.addresse }}
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
          button.no-button.search-address(v-if="searchAddressActive" @click="searchAddress()") Adresse suchen

      hr
      div.user-items
        p.user-item.title Telefon Nummer
        p.user-item.content(v-if="!editUserActive") {{ user.phoneNr }}
        input.user-item.input(v-else v-model="userForm.phoneNr" type='text' name="phoneNr" :placeholder="formPlaceholer.phoneNr")

      template(v-if="editUserActive")
        .options
          span.left
            button.button--alert.button.delete Profil löschen
          .right
            button.no-button.cancel(@click="toggleUserEdit()") abbrechen
            button.button.update Profil aktualisieren

</template>

<script>
export default {
  layout: 'with-map',
  middleware: 'auth',
  data: function() {
    return {
      editUserActive: false,
      searchAddressActive: false,
      userForm: {
        name: '',
        lastName: '',
        address: '',
        phoneNr: '',
        postalCode: '',
        area: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
      formPlaceholer: {
        name: 'Name',
        lastName: 'Nachname',
        address: 'Straße',
        phoneNr: 'Telefon Nummer',
        postalCode: 'Postleitzahl',
        area: 'Ort',
        email: 'Email',
        password: '',
        passwordConfirmation: ''
      }
    }
  },
  methods: {
    toggleUserEdit: function() {
      this.editUserActive = !this.editUserActive
      this.editUserActive && this.setUserForm()
      if (!this.editUserActive) {
        this.searchAddressActive = false
      }
    },
    toggleAddresSearch: function() {
      if (
        this.userForm.address &&
        this.userForm.postalCode &&
        this.userForm.area
      ) {
        this.searchAddressActive = true
      } else {
        this.searchAddressActive = false
      }
    },
    updateUser: function() {
      this.$store.dispatch('user/updateUser')
    },
    setUserForm: function() {
      this.userForm.name = this.user.name
      this.userForm.lastName = this.user.lastName
      this.userForm.address = this.user.address
      this.userForm.postalCode = this.user.postalCode
      this.userForm.area = this.user.area
      this.userForm.phoneNr = this.user.phoneNr
      this.userForm.email = this.user.email
    },
    searchAddress: function() {
      this.$store.dispatch('gmaps/GET_GEOLOCATION', {
        street: this.userForm.address,
        postlCode: this.userForm.postalCode,
        area: this.userForm.area
      })
    }
  },
  computed: {
    user() {
      return this.$store.state.user.data
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
