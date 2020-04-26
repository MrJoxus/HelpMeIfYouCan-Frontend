export const state = () => ({
  active: false,
  flash: false,
  img: undefined
})

export const mutations = {
  SET_IMG(state, payload) {
    state.img = payload
  },
  // CLEAR_IMG(state) {
  //   state.img = "undefined"
  // },
  ACTIVATE_MODAL(state) {
    state.active = true
  },
  DEACTIVATE_MODAL(state) {
    state.active = false
  },
  DEACTIVATE_FLASH(state) {
    state.flash = false
  },
  ACTIVATE_FLASH(state) {
    state.flash = true
  }
}

export const actions = {
  FLASH_MODAL({ commit, state }, payload) {
    if (!state.active) {
      commit('SET_IMG', payload)
      commit('ACTIVATE_MODAL')

      setTimeout(() => {
        commit('ACTIVATE_FLASH')
      }, 1)

      setTimeout(() => {
        commit('DEACTIVATE_MODAL')
        commit('DEACTIVATE_FLASH')
      }, 400)
    }
  }
}
