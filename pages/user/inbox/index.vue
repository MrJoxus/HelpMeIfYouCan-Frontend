<template lang='pug'>
  .inbox
    .main-content
      div.headline
        h1.title Nachrichten
      div.inbox-window
        div.messages
          .checkbox
            .img-wrapper(
              @click='toggleShow("received")'
              :class='{"img-wrapper--active": show == "received"}'
              )
              img.accepted(
                src='~assets/img/email.png')
            .img-wrapper(
              @click='toggleShow("send")'
              :class='{"img-wrapper--active": show == "send"}'
              )
              img.accepted(
                src='~assets/img/paper-plane.png')
          //- received
          div.message(
            v-if='show == "received" && application.id'
            v-for='application in messages.received'
            @click='updateactiveApplication(application)'
            :key='application.id'
            :class='{"message--read": application.read}'
            )
            h6.message-header(v-if='application.helpModelType == "HelpRequestModel"') {{ application.name }} möchte dir helfen!
            h6.message-header(v-if='application.helpModelType == "HelpOfferModel"') {{ application.name }} würde sich über deine hilfe freuen!
            div.message-info
              p.send {{formatTime(application.created, "DM")}} {{formatTime(application.created, "HM")}}
              img.accepted(
                v-if='application.phoneNr'
                src='~assets/img/agreement.png')
          //- send
          div.message.message--read(
            v-if='show == "send" && application.id'
            v-for='application in messages.send'
            @click='updateactiveApplication(application, show)'
            :key='application.id'
            )
            h6.message-header(v-if='application.helpModelType == "HelpRequestModel"') Du hast {{ application.name }} Hilfe angeboten.
            h6.message-header(v-if='application.helpModelType == "HelpOfferModel"') Du hast {{ application.name }} um Hilfe gebeten.
            div.message-info
              p.send {{formatTime(application.created, "DM")}} {{formatTime(application.created, "HM")}}
              img.accepted(
                v-if='application.phoneNr'
                src='~assets/img/agreement.png')


        //- messagebody
        div.message-body(v-if='activeApplication.id')
          img.cancel(
            src='~assets/img/cancel_2.png'
            @click='activeApplication = {}')

          //- received
          template(v-if='show == "received"')
            .content
              .accepted(
                v-if='activeApplication.phoneNr'
              )
                p {{ activeApplication.name }} hat deine Anfrage angenommen! Du kannst
                  |  {{ activeApplication.name }} unter folgender Nummer erreichen:
                p {{ activeApplication.phoneNr}}

              p.userName {{ activeApplication.name }}:
              p {{ activeApplication.message}}
              p ID: {{ activeApplication.id}}

            .message-body_options(v-if='!activeApplication.phoneNr')
              button.button.accept(@click='acceptApplication(activeApplication)') Anfrage akzeptieren
              p.info Mit dem Akzeptieren einer Anfrage, werden zur weiteren Kommunikation die
                |  Kontaktdaten zwischen dir und {{activeApplication.userName}} ausgetauscht.

          //- send
          template(v-if='show == "send"')
            .content
              .accepted(
                v-if='activeApplication.phoneNr'
              )
                p {{ activeApplication.name }} {{ activeApplication.lastName }} hat deine Anfrage angenommen!
                  |  Du kannst ihn nun kontaktieren unter der Nummer:
                p {{ activeApplication.phoneNr}}

              p.userName {{ user.name }}:
              p {{ activeApplication.message}}
              p ID: {{ activeApplication.id}}
            .message-body_options(v-if='!activeApplication.phoneNr')
              button.button.button--alert(@click='deleteApplication(activeApplication)') Anfrage zurücknehmen
              p.info Wenn {{ activeApplication.userName}} dein Angebot oder deine Anfrage annimmt, werden deine Kontaktdaten an
                |  {{activeApplication.userName}} weitergegeben. Zeitgleich erhälst du die Kontaktdaten von {{activeApplication.userName}}

</template>

<script>
import gmaps from '~/components/gmaps.vue'

export default {
  layout: 'default',
  components: { gmaps },
  middleware: 'auth',
  data: function() {
    return {
      activeApplication: {},
      show: 'received'
    }
  },
  computed: {
    user() {
      return this.$store.state.user.data
    },
    messages() {
      return this.$store.getters['user/messages']
    }
  },
  methods: {
    toggleShow(show) {
      if (this.show != show) {
        this.activeApplication = {}
        this.show = show
      }
    },
    formatTime(time, type) {
      let created = new Date(time)
      let month = created.getMonth() + 1
      let day = created.getDate()
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
    updateactiveApplication(application) {
      if (!application.read) {
        if (!(!application.lastName && this.show == 'send')) {
          this.$store.dispatch('user/MESSAGE_READ', application.id)
        }
      }
      if (application.id != this.activeApplication.id) {
        this.activeApplication = application
      }
    },
    deleteApplication(application) {
      let self = this
      let type
      if (application.helpModelType == 'HelpRequestModel') {
        type = 'help-request'
      } else {
        type = 'help-offer'
      }
      this.$axios
        .delete(`/api/${type}/unapply/${application.modelId}`)
        .then(response => {
          console.log('response', response.data)
          self.$store.dispatch('user/REQUEST_USER')
          self.activeApplication = {}
        })
        .catch(error => {
          console.log('error', error)
          this.$store.dispatch('modal/FLASH_MODAL', 'cancel')
        })
    },

    acceptApplication(application) {
      let type
      let self = this
      if (application.helpModelType == 'HelpOfferModel') {
        type = 'offer'
      } else if (application.helpModelType == 'HelpRequestModel') {
        type = 'request'
      }
      this.$axios
        .patch(
          `api/help-${type}/${application.modelId}/${application.id}/accept`
        )
        .then(response => {
          self.$store.disptach('user/REQUEST_USER')
          console.log('response', response)
        })
        .catch(error => {
          console.log('error', error)
          this.$store.dispatch('modal/FLASH_MODAL', 'cancel')
        })
    }
  },
  mounted() {
    this.$store.dispatch('user/REQUEST_USER')
    this.$store.commit('gmaps/UPDATE_STATUS', {
      show: { filter: false, markers: false }
    })
  }
}
</script>

<style lang='scss'>
.inbox {
  .main-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 800px;
    margin: 0 auto;
    padding-top: 40px;
    background: #f7f7f7;
    box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
    .headline {
      text-align: center;
      border-bottom: 1px solid #bbb;
    }
  }
  .inbox-window {
    display: flex;
    height: 600px;
  }
  .messages {
    overflow-y: scroll;
    height: 100%;
    width: 40%;
    border-right: 1px solid #bbb;
    .checkbox {
      position: sticky;
      top: 0;
      text-align: center;
      border-bottom: 1px solid #bbb;
      .img-wrapper {
        display: inline-block;
        border-radius: 2px;
        border: solid 1px #bbb;
        padding: 5px 5px 3px 5px;
        margin: 8px 16px;
        cursor: pointer;
      }
      .img-wrapper--active {
        border: solid 1px #227bc0;
      }
    }
  }
  .message {
    display: flex;
    padding: 16px 24px;
    color: black;
    border-bottom: 1px solid #bbb;
    border-left: 4px solid green;
    -webkit-tap-highlight-color: transparent;

    cursor: pointer;
    .message-header {
      display: inline-block;
      width: 80%;
      padding-bottom: 0;
    }
    .message-info {
      display: inline-block;
      width: 20%;
      text-align: right;
      font-size: 10px;
    }
    .send {
    }
    .accepted {
    }
    a {
      &:link,
      &:visited,
      &:hover,
      &:active {
        color: black;
      }
    }
    &:nth-child(even) {
      background: #eee;
    }
  }
  .message--read {
    border-left: 4px solid transparent;
  }
  .message-body {
    position: relative;
    width: 60%;
    .cancel {
      display: none;
    }
    .content {
      overflow-y: scroll;
      height: calc(100% - 108px);
      & > * {
        padding-right: 24px;
        padding-left: 24px;
      }
      p.userName {
        padding-top: 24px;
      }
    }
    .accepted {
      padding-top: 24px;
      background: #77dd77;
    }
    .message-body_options {
      padding: 24px;

      position: absolute;
      bottom: 0;
      height: 108px;
      width: 100%;
      padding: 8px 24px;
      text-align: right;

      .info {
        text-align: left;
        font-size: 11px;
      }
    }
    .message-body_options--send {
      height: 49px;
      margin-bottom: 32px;
    }
  }
}
@media (max-width: 640px) {
  .inbox {
    .main-content {
      position: static;
      transform: unset;
      width: 100%;
      height: calc(100vh - 56px);
    }
    .inbox-window {
      height: unset;
      display: block;
    }
    .messages {
      width: 100%;
      border-right: unset;
    }
    .message-body {
      backdrop-filter: blur(4px);
      z-index: 1001;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      background: white;
      .cancel {
        display: block;
        position: absolute;
        top: 32px;
        right: 32px;
        width: 16px;
      }
      .message-body_options {
        bottom: 56px;
      }
    }
  }
}
@media (min-width: 641px) and (max-width: 1367px) {
  .inbox {
    .main-content {
      position: static;
      transform: unset;
      width: 100%;
      height: 100%;
      box-shadow: unset;
    }
    .inbox-window {
      display: flex;
      height: calc(100vh - 175px);
    }
  }
}
</style>
