import { createStore } from 'vuex'

import colors from './colors'
import drawer from './drawer'

export default createStore({
  modules: {
    colors,
    drawer
  }
})
