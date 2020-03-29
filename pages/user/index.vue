<template lang="pug">
  .user
    .main-content
      div.headline
        h1.title Dein Profil
        .button.update-user(v-if="!editUser" @click="toggleUserEdit()") Profil bearbeiten
      div.user-items
        p.user-item.title Name
        p.user-item.content(v-if="!editUser") {{ user.name }}
        input.user-item.input(v-else v-model="userForm.name" type='text' name="lastName" :placeholder="user.name")
      hr
      div.user-items
        p.user-item.title Nachname
        p.user-item.content(v-if="!editUser") {{ user.lastName }}
        input.user-item.input(v-else v-model="userForm.lastName" type='text' name="lastName" :placeholder="user.lastName")
      hr
      div.user-items
        p.user-item.title Email
        p.user-item.content(v-if="!editUser") {{ user.email }}
        input.user-item.input(v-else v-model="userForm.email" type='text' name="lastName" :placeholder="user.email")
      hr
      div.user-items
        p.user-item.title Adresse
        p.user-item.content(v-if="!editUser") {{ user.addresse }}
        input.user-item.input(v-else v-model="userForm.addresse" type='text' name="lastName" :placeholder="user.addresse")
      hr
      div.user-items
        p.user-item.title Telefon Nummer
        p.user-item.content(v-if="!editUser") {{ user.phoneNr }}
        input.user-item.input(v-else v-model="userForm.phoneNr" type='text' name="lastName" :placeholder="user.phoneNr")

      template(v-if="editUser")
        .options
          span.left
            .button.delete Profil löschen
          .right
            span.cancel(@click="toggleUserEdit()") abbrechen
            .button.update Profil aktualisieren

</template>

<script>
export default {
  layout: 'with-map',
  middleware: 'auth',
  data: function() {
    return {
      editUser: false,
      userForm: {
        name: '',
        lastName: '',
        address: '',
        phoneNr: '',
        postalcode: '',
        area: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      }
    }
  },
  methods: {
    toggleUserEdit: function() {
      this.editUser = !this.editUser
    },
    updateUser: function() {
      this.$store.dispatch('user/updateUser')
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
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 640px;
    margin: 0 auto;
    padding: 40px;
    background: #f7f7f7;
    box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
    h1 {
      text-align: left;
    }
    hr{
      background: #000;
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
    }
  }
  .options {
    margin-top: 24px;
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
    margin-top: 4px;
    margin-bottom: 4px;
  }
}
</style>
