export const state = () => ({
  set: false,
  edit: false,
  data: {
    name: null,
    lastName: null,
    addresses: null,
    phoneNr: null,
    payPal: null,
    email: null
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
    console.log('payload', payload)
    state.data.name = payload.name
    state.data.lastName = payload.lastName
    state.data.email = payload.email
    state.data.phoneNr = payload.phoneNr

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
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  UPDATE_USER({ commit }, payload) {
    let self = this
    this.$axios
      .patch('api/user/me', payload)
      .then(response => {
        commit('SET_USER', response.data)
        commit('TOGGLE_USER_EDIT')
      })
      .catch(error => {
        console.log('error', error)
        commit('UPDATE_ERROR', { status: true })
      })
  }
}
