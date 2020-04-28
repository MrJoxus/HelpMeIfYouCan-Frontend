<template lang='pug'>
  .user-applications
    .main-content
      div.headline
        h1.title Deine Anzeigen
      .items-wrapper
        .items
          p.empty(v-show='userHelpOR.length == 0') Du hast momentan keine aktiven Anzeigen.
            |  Hier kannst du eine
            nuxt-link(to='/create')  Anzeige erstellen.

          .item(v-for='item in userHelpOR') {{ setModel(item.id, item.description) }}
            p.mesage-title Nachricht:
            p.date {{formatTime(item.datePublished, "DM")}} {{formatTime(item.datePublished, "HM")}}
            p.message-body(v-if='!(item.id == edit)') {{item.description}}
            textarea.input-textarea(
              v-if='item.id == edit'
              v-model='model.parent_id[item.id]')
            .options
              button.button.edit(
                @click='edit = item.id'
                v-if='!(item.id == edit)') bearbeiten
              button.button.save(
                @click='submit(item.type, item.id, model.parent_id[item.id] )'
                v-else) Speichern
              .button.no-button.cancel(
                @click='edit = undefined'
                v-if='item.id == edit') abbrechen
              .delete(
                v-if='item.id == edit'
                @click='deleteItem(item.type, item.id)')
                img(src='~/assets/img/delete.png')
</template>

<script>
export default {
  layout: 'default',
  middleware: 'auth',
  data: function() {
    return {
      edit: undefined,
      model: {
        parent_id: []
      }
    }
  },

  methods: {
    setModel(id, description) {
      this.model.parent_id[id] = description
    },
    formatTime(time, type) {
      let created = new Date(time)
      let month = created.getMonth()
      let day = created.getDay()
      let hours = created.getHours()
      let minutes = created.getMinutes()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      minutes = minutes < 10 ? '0' + minutes : minutes
      hours = hours < 10 ? '0' + hours : hours
      if (type == 'DM') {
        return `${day}.${month}`
      } else if (type == 'HM') {
        return `${hours}:${minutes}`
      }
    },
    submit(type, id, description) {
      this.$axios
        .patch(`/api/${type}/${id}`, { description: description })
        .then(response => {
          this.$store.dispatch('user/REQUEST_USER')
          this.$store.dispatch('modal/FLASH_MODAL', 'tick')

          this.edit = undefined
        })
        .catch(error => {
          console.log('error', error)
        })
    },
    deleteItem(type, id) {
      let confirmation = confirm('Diese Nachricht löschen?')
      if (confirmation) {
        this.$axios
          .delete(`/api/${type}/${id}`)
          .then(response => {
            this.$store.dispatch('user/REQUEST_USER')
          })
          .catch(error => {
            console.log('error', error)
          })
      }
    },
    loadItems() {
      let array = []
      this.userHelpORId.helpRequests.forEach(item => {
        array.push({ type: 'help-request', id: item })
      })
      this.userHelpORId.helpOffers.forEach(item => {
        array.push({ type: 'help-offer', id: item })
      })
      this.$store.commit('gmaps/CLEAR_USER_HELP_O_R')
      this.$store.dispatch('gmaps/GET_USER_HELP_O_R', array)
    }
  },
  computed: {
    userHelpORId() {
      return {
        helpRequests: this.$store.state.user.data.helpRequests,
        helpOffers: this.$store.state.user.data.helpOffers
      }
    },
    userHelpOR() {
      return this.$store.state.gmaps.userHelpOR
    }
  },
  watch: {
    userHelpORId() {
      this.loadItems()
    }
  },
  created() {
    if (
      !(
        this.userHelpORId.helpRequests == undefined &&
        this.userHelpORId.helpOffers == undefined
      )
    ) {
      this.loadItems()
    }
    this.$store.commit('gmaps/UPDATE_STATUS', {
      show: { filter: false, markers: false }
    })
  },
}
</script>

<style lang='scss'>
.user-applications {
  background: red;
  .main-content {
    position: absolute;
    top: calc(56px + 56px);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 640px;
    margin: 0 auto;
    background: #f7f7f7;
    box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
    h1 {
      text-align: left;
    }
    .headline {
      padding: 40px 40px 0 40px;
      position: relative;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.05);
    }
  }
  .items-wrapper {
    overflow-y: scroll;
    max-height: calc(80vh - 118px);
  }
  .items {
    height: calc(80vh - 118px);
    max-height: calc(80vh - 118px);
    padding-left: 40px;
    padding-right: 32px;
    .empty {
      opacity: 0;
      padding-top: 24px;
    }
    .item {
      border: solid 1px #eee;
      padding: 24px;
      margin: 32px 0;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
      .input-textarea {
        height: 200px;
        opacity: 1;
        width: 100%;
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #919191;
        resize: none;
        transition: all 0.2s ease;
      }
      .mesage-title {
        display: inline-block;
      }
      .message-body {
        word-break: break-all;
      }
      .date {
        display: inline-block;
        float: right;
        text-align: right;
        font-size: 10px;
      }
      .options {
        .delete {
          float: right;
          display: inline-block;
          border: solid 1px red;
          border-radius: 4px;
          padding: 4px 4px 2px 4px;
          margin-top: 8px;
          cursor: pointer;
        }
        .save,
        .edit {
          margin-left: 0;
        }
        .cancel {
          padding: 8px 16px;
          color: black;
          &:hover {
            border: unset;
            box-shadow: unset;
          }
        }
      }
    }
  }
}
@media (max-width: 640px) {
  .user-applications {
    .main-content {
      position: static;
      transform: unset;
      width: 100%;
      height: 100%;
      box-shadow: unset;
      padding-bottom: 32px;
      .headline {
        padding-top: 24px;
      }
    }
    .items-wrapper {
      overflow: unset;
      max-height: unset;
    }
    .items {
      height: auto;
      max-height: unset;
      padding-left: 16px;
      padding-right: 16px;
    }
  }
}
</style>
