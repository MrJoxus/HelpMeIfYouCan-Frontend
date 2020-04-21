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
      markers: true,
      filter: false
    }
  },
  trigger: {
    cluster: 0
  }
})

export const mutations = {
  UPDATE_CENTER(state, payload) {
    state.center = payload
  },
  TOGGLE_MARKERS(state) {
    state.status.show.markers = !state.status.show.markers
  },
  UPDATE_STATUS(state, payload) {
    Object.keys(payload).forEach(key => {
      Object.assign(state.status[key], payload[key])
    })
  },
  ADD_LOCATION(state, payload) {
    let key
    if (payload.type == 'locations') {
      key = 'locations'
    } else if (payload.type == 'help-offer') {
      key = 'helpOfferLocations'
    } else if (payload.type == 'help-request') {
      key = 'helpRequestLocations'
    }
    let addNewLocation = true
    state[key].forEach(location => {
      if (
        location.lat == payload.data.coordinates.latitude &&
        location.lng == payload.data.coordinates.longitude
      ) {
        let addNewData = true
        addNewLocation = false
        location.data.forEach(data => {
          if (data.id == payload.data.id) addNewData = false
        })
        if (addNewData) {
          let data = {}
          data = payload.data
          data.type = payload.type
          location.data.push(data)
        }
      }
    })
    if (addNewLocation) {
      let data = {}
      data = payload.data
      data.type = payload.type
      state[key].push({
        lat: payload.data.coordinates.latitude,
        lng: payload.data.coordinates.longitude,
        data: [data]
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
        `${payload.street} ${payload.houseNumber}, ${payload.postalCode}, ${payload.area}`
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
    if (payload == 'help-offer') {
      key = 'helpOffers'
    } else if (payload == 'help-request') {
      key = 'helpRequests'
    }
    this.$axios
      .get(
        `/api/coords/${requestType}s/?longitude=${lng}&latitude=${lat}&radius=${radius}`
      )
      .then(response => {
        response.data.forEach(coordinate => {
          coordinate[key].forEach(id => {
            dispatch('GET_HELP_O_R', {
              id: id,
              type: requestType
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
      .get(`/api/${payload.type}/${payload.id}`)
      .then(response => {
        commit('ADD_LOCATION', { data: response.data, type: 'locations' })
        commit('ADD_LOCATION', { data: response.data, type: payload.type })
        commit('TRIGGER', ['cluster'])
      })
      .catch(error => {
        console.log('error', error)
      })
  }
}
