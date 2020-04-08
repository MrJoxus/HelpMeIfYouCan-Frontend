export const state = () => ({
  center: { lat: 53.565965, lng: 9.948829 },
  locations: [
    { id: 0, type: 'Gesuch', lat: 53.565965, lng: 9.948829 },
    { id: 1, type: 'Gesuch', lat: 53.6179168, lng: 10.088444 },
    { id: 2, type: 'Angebot', lat: 53.6179168, lng: 10.088745 }
  ],
  ownLocation: { lat: 53.565965, lng: 9.948829 },
  status: {
    loaded: {
      map: false
    },
    show: {
      markers: true
    }
  },

  infoWindow: {
    dummyContent: [
      {
        type: 'Gesuch1',
        description:
          'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
      },
      {
        type: 'Angebot1',
        description:
          'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
      },
      {
        type: 'Angebot2',
        description:
          'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
      }
    ]
  }
})

export const mutations = {
  UPDATE_CENTER(state, payload) {
    console.log('UPDATE_CENTER')
    state.center = payload
  },
  TOGGLE_MARKERS(state) {
    state.status.show.markers = !state.status.show.markers
  },
  UPDATE_STATUS(state, payload) {
    let key = Object.keys(payload)[0]
    state.status[key] = payload[key]
  },
  ADD_LOCATION(state, payload) {
    state.locations.push(payload)
  },
  UPDATE_OWN_LOCATION(state, payload) {
    state.ownLocation = payload
  }
}

export const actions = {
  GET_GEOLOCATION({ commit }, payload) {
    console.log('GET_GEOLOCATION', payload)
    let addressQuery
    if (Object.keys(payload) == 'string') {
      addressQuery = payload.string
    } else {
      addressQuery = encodeURIComponent(
        `${payload.street}, ${payload.postalCode}, ${payload.area}`
      )
    }
    console.log("query", addressQuery)
    let url = `https://maps.googleapis.com/maps/api/geocode/json?&address=${addressQuery}&key=${process.env.GOOGLE_API_KEY}`
    delete this.$axios.defaults.headers.common['Authorization']

    this.$axios
      .get(url)
      .then(response => {
        if (response.data.results.length != 0) {
          let location = response.data.results[0].geometry.location
          commit('UPDATE_CENTER', location)
          // commit('UPDATE_OWN_LOCATION', location)
        } else {
          console.log(response.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
