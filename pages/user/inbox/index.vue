<template lang='pug'>
  .inbox
    .main-content
      div.headline
        h1.title Nachrichten
      div.inbox-window
        div.messages
          nuxt-link.message(
            v-for='message in messages'
            :to='"inbox/" + message.id'
            :class='{"message--read": message.read}'
            )
            h6.message-header(v-if='message.type == "help-offer"') {{message.user}} möchte dir helfen!
            h6.message-header(v-if='message.type == "help-request"') {{message.user}} würde sich über deine hilfe freuen!
            div.message-info
              p.send {{message.send}}
              img.accepted(
                v-if='message.accepted'
                src='~assets/img/agreement.png')

        div.message-body
          .content
            p {{ messageBody.text}}
          .message-body_options
            button.button.accept Anfrage akzeptieren
            p.info Mit dem Akzeptieren einer Anfrage, werden zur weiteren Kommunikation die
             |  Kontaktdaten zwischen dir und {{messageBody.user}} ausgetauscht.
</template>

<script>
export default {
  layout: 'with-map',
  middleware: 'auth',
  data: function() {
    return {
      messages: [
        {
          id: 1,
          type: 'help-offer',
          user: 'Moritz',
          send: '18.04',
          read: false,
          accepted: false
        },
        {
          id: 2,
          type: 'help-request',
          user: 'Moritz',
          send: '18.04',
          read: true,
          accepted: true
        },
        {
          id: 3,
          type: 'help-offer',
          user: 'Moritz',
          send: '18.04',
          read: false,
          accepted: false
        },
        {
          id: 4,
          type: 'help-request',
          user: 'Moritz',
          send: '18.04',
          read: true,
          accepted: false
        }
      ],
      messageBody: {
        name: 'Moritz',
        text:
          'Bacon ipsum dolor amet pig salami tenderloin, t-bone shoulder hamburger frankfurter pastrami jowl pork chop meatball. Flank jowl capicola alcatra strip steak pastrami pork bresaola chicken chuck. Tail tri-tip jowl, landjaeger short ribs pork loin bresaola biltong. Sirloin flank turducken brisket, alcatra landjaeger meatloaf leberkas jowl jerky cow beef chuck rump t-bone.Bacon ipsum dolor amet pig salami tenderloin, t-bone shoulder hamburger frankfurter pastrami jowl pork chop meatball. Flank jowl capicola alcatra strip steak pastrami pork bresaola chicken chuck. Tail tri-tip jowl, landjaeger short ribs pork loin bresaola biltong. Sirloin flank turducken brisket, alcatra landjaeger meatloaf leberkas jowl jerky cow beef chuck rump t-bone.Bacon ipsum dolor amet pig salami tenderloin, t-bone shoulder hamburger frankfurter pastrami jowl pork chop meatball. Flank jowl capicola alcatra strip steak pastrami pork bresaola chicken chuck. Tail tri-tip jowl, landjaeger short ribs pork loin bresaola biltong. Sirloin flank turducken brisket, alcatra landjaeger meatloaf leberkas jowl jerky cow beef chuck rump t-bone.Bacon ipsum dolor amet pig salami tenderloin, t-bone shoulder hamburger frankfurter pastrami jowl pork chop meatball. Flank jowl capicola alcatra strip steak pastrami pork bresaola chicken chuck. Tail tri-tip jowl, landjaeger short ribs pork loin bresaola biltong. Sirloin flank turducken brisket, alcatra landjaeger meatloaf leberkas jowl jerky cow beef chuck rump t-bone.'
      }
    }
  },

  methods: {}
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
    height: 600px
  }
  .messages {
    overflow-y: scroll;
    height: 100%;
    width: 40%;
    border-right: 1px solid #bbb;
  }
  .message {
    display: flex;
    padding: 16px 24px;
    color: black;
    border-bottom: 1px solid #bbb;
    border-left: 4px solid green;

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
    .content {
      padding: 24px;
      overflow-y: scroll;
      height: calc(100% - 108px);
    }
    .message-body_options {
      padding: 24px;

      position: absolute;
      bottom: 0;
      height: 108px;
      padding: 8px 24px;
      text-align: right;

      .button.accept {
      }
      .info {
        text-align: left;
        font-size: 11px;
      }
    }
  }
}
</style>
