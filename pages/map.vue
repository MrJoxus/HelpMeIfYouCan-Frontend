<template lang="pug">
  .page-map
    //- .results-wrapper
      //- form(@submit='submitAddress')
        //- .filter
        //-   input.input.input-street(
        //-     v-model="filter.address"
        //-     @keyup=""
        //-     type='text'
        //-     placeholder="Straße, Plz, Ort"
        //-     )

        //-   .search
        //-     .checkbox(@click="filter.helpRequest = !filter.helpRequest")
        //-       span Anfragen
        //-       input.input(
        //-         v-model="filter.helpRequest"
        //-         @keyup=""
        //-         type='checkbox'
        //-         )
        //-     .checkbox(@click="filter.helpOffer = !filter.helpOffer")
        //-       span Angebote
        //-       input.input(
        //-         v-model="filter.helpOffer"
        //-         @keyup=""
        //-         type='checkbox'
        //-         )
        //-     button.button(@click='submitAddress') Suchen
      //- .results
      //-   .result-item(
      //-     v-for=''
      //-   )
      //-     h4.header Martin möchte helfen
      //-     .description Bacon ipsum dolor amet ground round ball tip shank,
      //-       | sirloin buffalo picanha kevin tri-tip pork belly frankfurter leberkas salami. Drumstick pastrami ground round ribeye.
      //-     button.button Kontaktieren
</template>
<script>
export default {
  layout: 'with-map',
  data: function() {
    return {
      filter: {
        helpOffer: true,
        helpRequest: true,
        address: undefined
      }
    }
  },
  methods: {
    test: function() {
      console.log('method test')
    },
    submitAddress(e) {
      e.preventDefault()

      this.$store.dispatch('gmaps/GET_GEOLOCATION', {
        string: this.filter.address
      })
    }
  },
  mounted() {
    this.$store.dispatch('gmaps/GET_HELP_O_R_ARRAY', 'help-offer')
    this.$store.dispatch('gmaps/GET_HELP_O_R_ARRAY', 'help-request')
  }
}
</script>

<style lang="scss">
// .page-map {
//   position: relative;
//   .results-wrapper {
//     // background: #f7f7f7;
//     // position: absolute;
//     // top: 40px;
//     // right: 40px;
//     // height: calc(100vh - 136px);
//     top: 0;
//     right: 0;
//     // height: calc(100vh - 56px);
//     // width: 600px;
//     overflow: hidden;
//     overflow-y: scroll;
//     box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.3);
//   }
//   .filter {
//     z-index: 1000;
//     position: fixed;
//     bottom: 24px;
//     left: 50%;
//     transform: translateX(-50%);
//     background: #f7f7f7;
//     padding: 16px;
//     padding-top: 24px;
//     box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.3);

//     .checkbox {
//       display: inline-block;
//       cursor: pointer;
//       user-select: none;
//       input {
//         margin: 8px 8px 16px 8px;
//         width: unset;
//         display: inline-block;
//         cursor: pointer;
//       }
//     }
//     .search {
//       span {
//         margin-left: 16px;
//         cursor: pointer;
//       }
//     }
//     .button {
//       margin-right: 0;
//       margin-top: 0;
//       float: right;
//     }
//   }
//   .results {
//     padding: 0 16px 16px 16px;
//   }
//   .result-item {
//     height: 56px;
//     overflow: hidden;
//     margin: 8px 0;
//     padding: 14px 24px;
//     background: white;
//     border-radius: 4px;
//     border: 1px solid #eee;
//     transition: all 0.2s ease;
//     cursor: pointer;
//     .header {
//     }
//     .description {
//       margin-bottom: 16px;
//     }
//   }
//   .result-item--active {
//     height: auto;
//     overflow: unset;
//     padding: 24px;
//     cursor: unset;
//   }
// }
// .map-wrapper {
//   width: calc(100vw - 500px);
// }
</style>
