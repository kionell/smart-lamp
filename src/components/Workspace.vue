<template>
  <div
    ref="workspaceArea"
    class="workspace"
    :style="{ cursor: cursorURL }"
    @mousedown.prevent.stop="startDrawing"
  >
    <perfect-scrollbar
      ref="workspaceScroll"
      class="workspace__scroll"
      :class="{'horizontal-centering': centerX, 'vertical-centering': centerY}"
      @ps-scroll-x="resizeViewport"
      @ps-scroll-y="resizeViewport"
    >
      <div
        ref="drawingArea"
        class="workspace__drawing-area"
      >
        <svg ref="checkers" class="drawing-area__background" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" style="fill: #FFFFFF"></rect>
            <rect x="30" y="30" width="30" height="30" style="fill: #FFFFFF"></rect>
            <rect x="30" width="30" height="30" style="fill: #CCCCCC"></rect>
            <rect y="30" width="30" height="30" style="fill: #CCCCCC"></rect>
          </pattern>
          <rect width="100%" height="100%" style="fill: url(#pattern);"></rect>
        </svg>

        <canvas
          ref="showCanvas"
          class="drawing-area__show-canvas canvases"
        ></canvas>
        <canvas
          ref="editCanvas"
          class="drawing-area__edit-canvas canvases"
        ></canvas>

        <div
          ref="selectionArea"
          class="drawing-area__selection"
          v-show="showSelection"
        ></div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default defineComponent({
  data () {
    return {
      editContext: null,
      showContext: null,
      centerX: true,
      centerY: true,
      showSelection: false
    }
  },
  computed: {
    ...mapGetters({
      width: 'drawer/getWidth',
      height: 'drawer/getHeight',
      boundaries: 'drawer/getBoundaries',
      isLimited: 'drawer/isLimited',
      scale: 'drawer/getScale',
      pixelSize: 'drawer/getPixelSize',
      previewViewport: 'drawer/getPreviewViewport',
      toolID: 'drawer/getCurrentTool',
      stateID: 'drawer/getCurrentState',
      cursorURL: 'drawer/getCurrentCursorURL',
      dataURL: 'drawer/getCurrentDataURL',
      stateHistory: 'drawer/getStateHistory'
    }),
    totalWidth () {
      return this.width * this.size
    },
    totalHeight () {
      return this.height * this.size
    },
    size () {
      return this.scale * this.pixelSize
    }
  },
  methods: {
    ...mapActions({
      setDrawerViewport: 'drawer/setDrawerViewport',
      setCurrentTool: 'drawer/setCurrentTool',
      setCurrentDataURL: 'drawer/setCurrentDataURL',
      setCurrentContext: 'drawer/setCurrentContext',
      setShowContext: 'drawer/setShowContext',
      addToHistory: 'drawer/addToHistory'
    }),
    updateViewport () {
      const workspaceArea = this.$refs.workspaceArea
      const workspaceScroll = this.$refs.workspaceScroll

      workspaceScroll.update()

      if (!workspaceArea) return

      const realViewport = {
        x: workspaceScroll.ps.lastScrollLeft,
        y: workspaceScroll.ps.lastScrollTop,
        width: workspaceArea.clientWidth,
        height: workspaceArea.clientHeight
      }

      this.setDrawerViewport(realViewport)
    },
    resizeViewport () {
      this.alignCanvas()

      this.$nextTick(() => {
        this.updateViewport()
      })
    },
    startDrawing (event) {
      this.$emit('startDrawing', event)
    },
    alignCanvas () {
      const workspaceArea = this.$refs.workspaceArea
      const drawingArea = this.$refs.drawingArea

      if (!workspaceArea || !drawingArea) return

      this.centerX = workspaceArea.clientWidth > drawingArea.clientWidth
      this.centerY = workspaceArea.clientHeight > drawingArea.clientHeight
    },
    scaleCanvas () {
      const drawingArea = this.$refs.drawingArea
      const checkers = this.$refs.checkers
      const selectionArea = this.$refs.selectionArea

      if (!drawingArea) return

      drawingArea.style.width = `${this.totalWidth}px`
      drawingArea.style.height = `${this.totalHeight}px`

      checkers.style.transform = `scale(${this.scale})`

      const left = this.boundaries.startX
      const top = this.boundaries.startY
      const width = this.boundaries.endX - this.boundaries.startX
      const height = this.boundaries.endY - this.boundaries.startY

      selectionArea.style.left = left * this.size + 'px'
      selectionArea.style.top = top * this.size + 'px'
      selectionArea.style.width = width * this.size + 'px'
      selectionArea.style.height = height * this.size + 'px'

      this.resizeViewport()
    },
    restoreState () {
      const version = this.stateHistory[this.stateID] ?? null

      if (!version || !this.editContext) return

      const img = new Image()

      img.onload = () => {
        const w = this.editContext.canvas.width
        const h = this.editContext.canvas.height

        this.editContext.clearRect(0, 0, w, h)
        this.editContext.drawImage(img, 0, 0)

        this.setCurrentDataURL(version.dataURL)
      }

      img.src = version.dataURL
    },
    setInitialState () {
      const version = {
        operation: 'create',
        dataURL: this.editContext.canvas.toDataURL()
      }

      this.addToHistory(version)
    }
  },
  mounted () {
    const edit = this.$refs.editCanvas
    const show = this.$refs.showCanvas
    const checkers = this.$refs.checkers

    edit.width = this.width
    edit.height = this.height

    show.width = edit.width * this.pixelSize
    show.height = edit.height * this.pixelSize

    checkers.style.width = `${this.width * this.pixelSize}px`
    checkers.style.height = `${this.width * this.pixelSize}px`

    this.showContext = show.getContext('2d')
    this.editContext = edit.getContext('2d')

    this.showContext.imageSmoothingEnabled = false
    this.editContext.imageSmoothingEnabled = false

    this.setCurrentContext(this.editContext)
    this.setShowContext(this.showContext)

    this.stateHistory.length > 0
      ? this.restoreState()
      : this.setInitialState()

    this.scaleCanvas()
    this.resizeViewport()

    window.addEventListener('resize', this.resizeViewport)
  },
  watch: {
    totalWidth () {
      this.scaleCanvas()
    },
    totalHeight () {
      this.scaleCanvas()
    },
    dataURL (newDataURL) {
      const img = new Image()

      img.onload = () => {
        const w1 = this.width
        const h1 = this.height
        const w2 = w1 * this.pixelSize
        const h2 = h1 * this.pixelSize

        this.showContext.clearRect(0, 0, w2, h2)
        this.showContext.drawImage(img, 0, 0, w1, h1, 0, 0, w2, h2)
      }

      img.src = newDataURL
    },
    'previewViewport.x' (newX) {
      const workspaceScroll = this.$refs.workspaceScroll

      if (Number.isFinite(newX) && workspaceScroll) {
        workspaceScroll.$el.scrollLeft = newX
      }
    },
    'previewViewport.y' (newY) {
      const workspaceScroll = this.$refs.workspaceScroll

      if (Number.isFinite(newY) && workspaceScroll) {
        workspaceScroll.$el.scrollTop = newY
      }
    },
    isLimited (showSelection) {
      this.showSelection = showSelection
    },
    boundaries: {
      deep: true,
      handler (newBoundaries) {
        const selectionArea = this.$refs.selectionArea

        let left = newBoundaries.startX
        let top = newBoundaries.startY
        let width = newBoundaries.endX - newBoundaries.startX
        let height = newBoundaries.endY - newBoundaries.startY

        if (newBoundaries?.startX < 0) {
          left = 0; width += newBoundaries.startX
        }

        if (newBoundaries?.startY < 0) {
          top = 0; height += newBoundaries.startY
        }

        if (newBoundaries?.endX > this.width) {
          width -= newBoundaries.endX - this.width
        }

        if (newBoundaries?.endY > this.height) {
          height -= newBoundaries.endY - this.height
        }

        selectionArea.style.left = left * this.size + 'px'
        selectionArea.style.top = top * this.size + 'px'
        selectionArea.style.width = width * this.size + 'px'
        selectionArea.style.height = height * this.size + 'px'
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .workspace {
    width: 100%;
    background-color: $background-color;
    z-index: -1;
    position: relative;
  }

  .workspace__scroll {
    display: flex;
  }

  .workspace__drawing-area {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
  }

  .drawing-area__background {
    position: absolute;
    z-index: -2;
  }

  .drawing-area__selection {
    pointer-events: none;
    position: absolute;
    background-color: $selected-color;
    box-sizing: border-box;
    border: 2px solid darken($selected-color, 25%);
    opacity: 0.5;
  }

  .drawing-area__edit-canvas {
    display: none;
  }

  .horizontal-centering {
    justify-content: center;
  }

  .vertical-centering {
    align-items: center;
  }
</style>
