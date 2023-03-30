export default {
  namespaced: true,
  state: {
    mainColor: '#000000',
    secondaryColor: '#FFFFFF',
    history: []
  },
  getters: {
    getMainColor (state) {
      return state.mainColor
    },
    getSecondaryColor (state) {
      return state.secondaryColor
    },
    getColorsHistory (state) {
      return state.history
    }
  },
  mutations: {
    LOAD_COLOR_PICKER (state) {
      const json = localStorage.getItem('colorpicker-history')
      const main = localStorage.getItem('colorpicker-main')
      const secondary = localStorage.getItem('colorpicker-secondary')

      if (json) state.history = JSON.parse(json)
      if (main) state.mainColor = main
      if (secondary) state.secondaryColor = secondary
    },
    SET_HISTORY (state, history) {
      localStorage.setItem('colorpicker-history', JSON.stringify(history))

      state.history = history
    },
    SET_MAIN_COLOR (state, color) {
      localStorage.setItem('colorpicker-main', color)

      state.mainColor = color
    },
    SET_SECONDARY_COLOR (state, color) {
      localStorage.setItem('colorpicker-secondary', color)

      state.secondaryColor = color
    }
  },
  actions: {
    loadColorPicker ({ commit }) {
      commit('LOAD_COLOR_PICKER')
    },
    setColorsHistory ({ commit }, history) {
      commit('SET_HISTORY', history)
    },
    setMainColor ({ commit }, color) {
      commit('SET_MAIN_COLOR', color)
    },
    setSecondaryColor ({ commit }, color) {
      commit('SET_SECONDARY_COLOR', color)
    }
  }
}
