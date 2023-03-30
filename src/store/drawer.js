export default {
  namespaced: true,
  state: {
    dimensions: {
      width: 16,
      height: 16
    },

    boundaries: {
      startX: 0,
      startY: 0,
      endX: 16,
      endY: 16
    },

    isLimited: false,

    drawerViewport: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },

    previewViewport: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },

    canvasScale: 1,
    pixelSize: 30,

    tools: [],

    currentTool: -1,
    currentState: -1,
    currentContext: null,
    showContext: null,
    currentDataURL: null,
    currentCursorURL: null,

    stateLimit: 100,
    stateHistory: []
  },
  getters: {
    getWidth (state) {
      return state.dimensions.width
    },
    getHeight (state) {
      return state.dimensions.height
    },
    getBoundaries (state) {
      return state.boundaries
    },
    isLimited (state) {
      return state.isLimited
    },
    getDrawerViewport (state) {
      return state.drawerViewport
    },
    getPreviewViewport (state) {
      return state.previewViewport
    },
    getScale (state) {
      return state.canvasScale
    },
    getPixelSize (state) {
      return state.pixelSize
    },
    getTools (state) {
      return state.tools
    },
    getCurrentTool (state) {
      return state.currentTool
    },
    getCurrentCursorURL (state) {
      return state.currentCursorURL
    },
    getCurrentState (state) {
      return state.currentState
    },
    getCurrentContext (state) {
      return state.currentContext
    },
    getShowContext (state) {
      return state.showContext
    },
    getCurrentDataURL (state) {
      return state.currentDataURL
    },
    getStateHistory (state) {
      return state.stateHistory
    }
  },
  mutations: {
    LOAD_DRAWER (state) {
      const dimensionsJSON = localStorage.getItem('drawer-dimensions')
      const historyJSON = localStorage.getItem('drawer-history')

      const dimensions = JSON.parse(dimensionsJSON)
      const cursorURL = localStorage.getItem('drawer-cursor')
      const toolID = localStorage.getItem('drawer-tool')
      const stateID = localStorage.getItem('drawer-state')

      state.matrixWidth = dimensions?.width ?? state.matrixWidth
      state.matrixHeight = dimensions?.height ?? state.matrixHeight
      state.currentTool = toolID ?? state.currentTool
      state.currentCursorURL = cursorURL ?? state.currentCursorURL
      state.currentState = stateID ?? state.currentState
      state.stateHistory = JSON.parse(historyJSON) ?? state.stateHistory
    },
    SET_DRAWER_DIMENSIONS (state, dimensions) {
      state.dimensions.width = dimensions?.width ?? state.dimensions.width
      state.dimensions.height = dimensions?.height ?? state.dimensions.height

      localStorage.setItem('drawer-dimensions', JSON.stringify(state.dimensions))
    },
    SET_DRAWER_BOUNDARIES (state, boundaries) {
      state.boundaries.startX = boundaries?.startX ?? state.boundaries.startX
      state.boundaries.startY = boundaries?.startY ?? state.boundaries.startY
      state.boundaries.endX = boundaries?.endX ?? state.boundaries.endX
      state.boundaries.endY = boundaries?.endY ?? state.boundaries.endY
    },
    ENABLE_LIMITS (state, enable) {
      state.isLimited = !!enable
    },
    SET_DRAWER_SCALE (state, scale) {
      state.canvasScale = Math.max(0.5, Math.min(scale, 5))
    },
    SET_DRAWER_VIEWPORT (state, viewport) {
      const drawerViewport = state.drawerViewport

      drawerViewport.x = viewport?.x ?? drawerViewport.x
      drawerViewport.y = viewport?.y ?? drawerViewport.y

      drawerViewport.width = viewport?.width ?? drawerViewport.width
      drawerViewport.height = viewport?.height ?? drawerViewport.height
    },
    SET_PREVIEW_VIEWPORT (state, viewport) {
      const previewViewport = state.previewViewport

      previewViewport.x = viewport?.x ?? previewViewport.x
      previewViewport.y = viewport?.y ?? previewViewport.y

      previewViewport.width = viewport?.width ?? previewViewport.width
      previewViewport.height = viewport?.height ?? previewViewport.height
    },
    SET_TOOLS (state, tools) {
      state.tools = tools ?? state.tools

      if (state.currentTool < 0 && state.tools?.length > 0) {
        state.currentTool = 0
      }

      localStorage.setItem('drawer-tool', state.currentTool)
    },
    SET_CURRENT_TOOL (state, toolID) {
      state.currentTool = toolID ?? state.currentTool

      localStorage.setItem('drawer-tool', state.currentTool)
    },
    SET_CURRENT_CURSOR_URL (state, cursorURL) {
      state.currentCursorURL = cursorURL ?? state.currentCursorURL

      localStorage.setItem('drawer-cursor', state.currentCursorURL)
    },
    SET_CURRENT_STATE (state, stateID) {
      const limit = Math.min(state.stateHistory.length, state.stateLimit) - 1
      const min = Math.min(stateID ?? state.currentTool, limit)

      state.currentState = Math.max(0, min)

      if (state.currentState >= 0) {
        state.currentDataURL = state.stateHistory[state.currentState].dataURL
      }

      localStorage.setItem('drawer-state', state.currentState)
    },
    SET_SHOW_CONTEXT (state, context) {
      state.showContext = context ?? state.showContext
    },
    SET_CURRENT_CONTEXT (state, context) {
      state.currentContext = context ?? state.currentContext
    },
    SET_CURRENT_DATA_URL (state, dataURL) {
      state.currentDataURL = dataURL ?? state.currentDataURL
    },
    ADD_TO_HISTORY (state, version) {
      if (typeof version !== 'object') return

      state.stateHistory.length = state.currentState + 1
      state.stateHistory = state.stateHistory.filter(x => x)
      state.stateHistory.push(version)

      state.currentState = state.stateHistory.length - 1
      state.currentDataURL = version.dataURL

      if (state.currentState >= state.stateLimit) {
        state.currentState = state.stateLimit
        state.stateHistory.shift()
      }

      const json = JSON.stringify(state.stateHistory)

      localStorage.setItem('drawer-history', json)
      localStorage.setItem('drawer-state', state.currentState)
    },
    REMOVE_FROM_HISTORY (state, stateID) {
      if (stateID < 0 || state.stateHistory.length <= stateID) return

      state.stateHistory.splice(stateID, 1)
      state.stateHistory = state.stateHistory.filter(x => x)

      const overflow = state.currentState >= state.stateHistory.length
      const previous = state.currentState > stateID

      if (overflow || previous) {
        state.currentState = Math.max(0, state.currentState - 1)
      }

      state.currentDataURL = state.stateHistory[state.currentState].dataURL

      const json = JSON.stringify(state.stateHistory)

      localStorage.setItem('drawer-history', json)
      localStorage.setItem('drawer-state', state.currentState)
    }
  },
  actions: {
    loadDrawer ({ commit }) {
      commit('LOAD_DRAWER')
    },
    setDimensions ({ commit }, dimensions) {
      commit('SET_DRAWER_DIMENSIONS', dimensions)
    },
    enableLimits ({ commit }, enable) {
      commit('ENABLE_LIMITS', enable)
    },
    setBoundaries ({ commit }, boundaries) {
      commit('SET_DRAWER_BOUNDARIES', boundaries)
    },
    setScale ({ commit }, scale) {
      commit('SET_DRAWER_SCALE', scale)
    },
    setDrawerViewport ({ commit }, viewport) {
      commit('SET_DRAWER_VIEWPORT', viewport)
    },
    setPreviewViewport ({ commit }, viewport) {
      commit('SET_PREVIEW_VIEWPORT', viewport)
    },
    setTools ({ commit }, tools) {
      commit('SET_TOOLS', tools)
    },
    setCurrentTool ({ commit }, toolID) {
      commit('SET_CURRENT_TOOL', toolID)
    },
    setCurrentCursorURL ({ commit }, cursorURL) {
      commit('SET_CURRENT_CURSOR_URL', cursorURL)
    },
    setCurrentState ({ commit }, stateID) {
      commit('SET_CURRENT_STATE', stateID)
    },
    setCurrentContext ({ commit }, context) {
      commit('SET_CURRENT_CONTEXT', context)
    },
    setShowContext ({ commit }, context) {
      commit('SET_SHOW_CONTEXT', context)
    },
    setCurrentDataURL ({ commit }, dataURL) {
      commit('SET_CURRENT_DATA_URL', dataURL)
    },
    addToHistory ({ commit }, version) {
      commit('ADD_TO_HISTORY', version)
    },
    removeFromHistory ({ commit }, stateID) {
      commit('REMOVE_FROM_HISTORY', stateID)
    }
  }
}
