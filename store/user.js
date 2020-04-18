export const state = () => ({
  set: false,
  edit: false,
  data: {
    id: undefined,
    name: undefined,
    lastName: undefined,
    userAddress: undefined,
    fullAddress: {
      street: undefined,
      district: undefined,
      zipCode: undefined,
      houseNumber: undefined,
      country: undefined,
      coordinates: {
        latitude: undefined,
        longitude: undefined
      }
    },
    phoneNr: undefined,
    email: undefined
  },
  addresSearch: {
    button: false
  },
  error: {
    status: false,
    message: undefined,
    type: undefined
  }
})

export const mutations = {
  SET_USER(state, payload) {
    if (payload.fullAddress) {
      payload.fullAddress.coordinates.lat =
        payload.fullAddress.coordinates.latitude
      payload.fullAddress.coordinates.lng =
        payload.fullAddress.coordinates.longitude
    }
    state.data = payload

    state.set = true
  },
  TOGGLE_USER_EDIT(state) {
    state.edit = !state.edit
  },
  UPDATE_ADDRES_SEARCH(state, payload) {
    let keys = Object.keys(payload)
    keys.forEach(key => {
      state.addresSearch[key] = payload[key]
    })
  },
  UPDATE_ERROR(state, payload) {
    let keys = Object.keys(payload)
    keys.forEach(key => {
      state.error[key] = payload[key]
    })
  }
}

export const actions = {
  REQUEST_USER({ commit }) {
    this.$axios
      .get('api/user/me', {
        headers: {
          Authorization: localStorage.getItem('auth._token.local')
        }
      })
      .then(response => {
        commit('SET_USER', response.data)

        if (
          response.data.fullAddress &&
          response.data.fullAddress.coordinates.latitude
        ) {
          commit(
            'gmaps/UPDATE_OWN_LOCATION',
            response.data.fullAddress.coordinates,
            { root: true }
          )
        }
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  UPDATE_USER({ commit, dispatch }, payload) {
    let emptyUser = true
    let emptyAddress = true

    for (var key in payload.user) {
      if (payload.user.hasOwnProperty(key)) emptyUser = false
    }
    for (var key in payload.address) {
      if (payload.address.hasOwnProperty(key)) emptyAddress = false
    }

    if (!emptyUser) {
      payload.user.currentPassword = payload.currentPassword
      this.$axios
        .patch('api/user/me', payload.user)
        .then(response => {
          commit('SET_USER', response.data)
          commit('TOGGLE_USER_EDIT')
          commit('UPDATE_ERROR', { status: false })
        })
        .catch(error => {
          console.log('error', error)
          commit('UPDATE_ERROR', { status: true })
        })
    }

    if (!emptyAddress) {
      payload.address.currentPassword = payload.currentPassword
      dispatch('UPDATE_ADDRESS', payload.address)
    }
  },
  UPDATE_ADDRESS({ state, commit }, payload) {
    if (state.data.userAddress == null) {
      payload.country = 'de'
      this.$axios
        .post('api/user/me/address', payload)
        .then(response => {
          commit('SET_USER', response.data)
          commit('TOGGLE_USER_EDIT')
          commit('UPDATE_ERROR', { status: false })
        })
        .catch(error => {
          console.log('error', error)
          commit('UPDATE_ERROR', { status: true })
        })
    } else {
      this.$axios
        .patch('api/user/me/address', payload)
        .then(response => {
          commit('SET_USER', response.data)
          commit('TOGGLE_USER_EDIT')
          commit('UPDATE_ERROR', { status: false })
        })
        .catch(error => {
          console.log('error', error)
          commit('UPDATE_ERROR', { status: true })
        })
    }
  }
}
