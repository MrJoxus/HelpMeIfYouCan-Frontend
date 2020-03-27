export const state = () => ({
  set: false,
  name: null,
  lastName: null,
  addresses: null,
  phoneNr: null,
  payPal: null,
  email: null
})

export const mutations = {
  updateUser(state, payload) {
    console.log('mutation updateUser')
    state.name = payload.name
    state.lastName = payload.lastName
    state.email = payload.email
    state.phoneNr = payload.phoneNr

    state.set = true
  }
}

export const actions = {
  getUser({ commit }) {
    // this.$axios
    //   .get('user/me', {
    //     headers: {
    //       Authorization: localStorage.getItem('auth._token.local')
    //     }
    //   })
    //   .then(response => {
    //     console.log(response.data)
    //     commit('updateUser', response.data )
    //   })
    //   .catch(error => {
    //     console.log('error', error)
    //   })
  }
}
