export const state = () => ({
  center: { lat: 53.565965, lng: 9.948829 },
  locations: [],
  helpRequestLocations: [],
  helpOfferLocations: [],
  ownLocation: { lat: undefined, lng: undefined },
  status: {
    loaded: {
      map: false
    },
    show: {
      markers: true
    }
  },
  trigger: {
    cluster: 0
  }

  // locations: [
  //   { id: 0, type: 'Gesuch', lat: 53.565965, lng: 9.948829 },
  //   { id: 1, type: 'Gesuch', lat: 53.6179168, lng: 10.088444 },
  //   { id: 2, type: 'Angebot', lat: 53.6179168, lng: 10.088745 }
  // ],
  // infoWindow: {
  //   dummyContent: [
  //     {
  //       type: 'Gesuch1',
  //       description:
  //         'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
  //     },
  //     {
  //       type: 'Angebot1',
  //       description:
  //         'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
  //     },
  //     {
  //       type: 'Angebot2',
  //       description:
  //         'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
  //     }
  //   ]
  // }
})

export const mutations = {
  UPDATE_CENTER(state, payload) {
    state.center = payload
  },
  TOGGLE_MARKERS(state) {
    state.status.show.markers = !state.status.show.markers
  },
  UPDATE_STATUS(state, payload) {
    let keys = Object.keys(payload)
    keys.forEach(key => {
      state.status[key] = payload[key]
    })
  },
  ADD_LOCATION(state, payload) {
    let createNewEntry = true
    state.locations.forEach(location => {
      if (location.lat == payload.lat && location.lng == payload.lng) {
        createNewEntry = false
        location.data.push({
          id: payload.id,
          user: payload.user,
          type: payload.type,
          description: payload.description
        })
      }
    })
    if (createNewEntry) {
      state.locations.push({
        lat: payload.lat,
        lng: payload.lng,
        data: [
          {
            id: payload.id,
            user: payload.user,
            type: payload.type,
            description: payload.description
          }
        ]
      })
    }
  },
  UPDATE_OWN_LOCATION(state, payload) {
    state.ownLocation = payload
  },
  TRIGGER(state, payload) {
    payload.forEach(key => {
      state.trigger[key] = state.trigger[key] + 1
    })
  }
}

export const actions = {
  GET_GEOLOCATION({ commit }, payload) {
    let addressQuery
    if (Object.keys(payload) == 'string') {
      addressQuery = payload.string
    } else {
      addressQuery = encodeURIComponent(
        `${payload.street}, ${payload.postalCode}, ${payload.area}`
      )
    }
    let url = `https://maps.googleapis.com/maps/api/geocode/json?&address=${addressQuery}&key=${process.env.GOOGLE_API_KEY}`
    delete this.$axios.defaults.headers.common['Authorization']

    this.$axios
      .get(url)
      .then(response => {
        if (response.data.results.length != 0) {
          let location = response.data.results[0].geometry.location
          commit('UPDATE_CENTER', location)
          commit('UPDATE_OWN_LOCATION', location)
        } else {
          console.log(response.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
    this.$axios.defaults.headers.common['Authorization'] = localStorage.getItem(
      'auth._token.local'
    )
  },
  GET_HELP_O_R_ARRAY({ state, dispatch }, payload) {
    let lat = state.ownLocation.lat || state.center.lat
    let lng = state.ownLocation.lng || state.center.lng
    let radius = 200
    let requestType = payload
    let key = ''
    if (payload == 'offer') {
      key = 'helpOffers'
    } else if (payload == 'request') {
      key = 'helpRequests'
    }
    this.$axios
      .get(
        `/api/coords/help-${requestType}s/?longitude=${lng}&latitude=${lat}&radius=${radius}`
      )
      .then(response => {
        response.data.forEach(coordinate => {
          coordinate[key].forEach(id => {
            dispatch('GET_HELP_O_R', {
              id: id,
              type: requestType,
              lat: coordinate.latitude,
              lng: coordinate.longitude
            })
          })
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  GET_HELP_O_R({ commit }, payload) {
    this.$axios
      .get(`/api/help-${payload.type}/${payload.id}`)
      .then(response => {
        commit('ADD_LOCATION', {
          id: response.data.id,
          user: response.data.user,
          type: payload.type,
          lat: payload.lat,
          lng: payload.lng,
          description: response.data.description
        })
        commit('TRIGGER', ['cluster'])
      })
      .catch(error => {
        console.log('error', error)
      })
  }
}
