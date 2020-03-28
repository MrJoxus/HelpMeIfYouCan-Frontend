export const state = () => ({
  set: false,
  data: {
    name: null,
    lastName: null,
    addresses: null,
    phoneNr: null,
    payPal: null,
    email: null
  }
})

export const mutations = {
  setUser(state, payload) {
    state.data.name = payload.name
    state.data.lastName = payload.lastName
    state.data.email = payload.email
    state.data.phoneNr = payload.phoneNr

    state.set = true
  }
}

export const actions = {
  requestUser({ commit }) {
    this.$axios
      .get('api/user/me', {
        headers: {
          Authorization: localStorage.getItem('auth._token.local')
        }
      })
      .then(response => {
        console.log(response.data)
        commit('setUser', response.data)
      })
      .catch(error => {
        console.log('error', error)
      })
  },
  updateUser({ commit }) {
    this.$axios
      .patch('api/user/me', {
        headers: {
          Authorization: localStorage.getItem('auth._token.local')
        },
        data: {
          name: 'Jochen'
        }
      })
      .then(response => {
        console.log(response.data)
        commit('setUser', response.data)
      })
      .catch(error => {
        console.log('error', error)
      })
  }
}
