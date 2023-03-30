<template>
  <div class="viewport">
    <div
      class="viewport__preview"
      @mousedown.prevent.stop="moveViewportArea"
    >
      <svg ref="checkers" class="viewport__background" xmlns="http://www.w3.org/2000/svg">
        <pattern id="viewport-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" style="fill: #FFFFFF"></rect>
          <rect x="10" y="10" width="10" height="10" style="fill: #FFFFFF"></rect>
          <rect x="10" width="10" height="10" style="fill: #CCCCCC"></rect>
          <rect y="10" width="10" height="10" style="fill: #CCCCCC"></rect>
        </pattern>
        <rect width="160" height="160" style="fill: url(#viewport-pattern);"></rect>
      </svg>

      <canvas ref="preview" class="viewport__show canvases"></canvas>

      <div
        @mousedown.prevent.stop="dragViewportArea"
        ref="viewportArea"
        class="viewport__area"
        v-show="showViewportArea"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default defineComponent({
  data () {
    return {
      previewContext: null,
      previewSize: 160,
      showViewportArea: true,
      movingPreview: false,
      sizeDifference: 1,
      viewportAreaLeft: 0,
      viewportAreaTop: 0,
      viewportAreaWidth: 0,
      viewportAreaHeight: 0
    }
  },
  computed: {
    ...mapGetters({
      width: 'drawer/getWidth',
      height: 'drawer/getHeight',
      scale: 'drawer/getScale',
      pixelSize: 'drawer/getPixelSize',
      drawerViewport: 'drawer/getDrawerViewport',
      context: 'drawer/getCurrentContext',
      dataURL: 'drawer/getCurrentDataURL'
    }),
    totalWidth () {
      return this.width * this.scale * this.pixelSize
    },
    totalHeight () {
      return this.height * this.scale * this.pixelSize
    },
    sizeDifferenceX () {
      return this.totalWidth / this.previewSize
    },
    sizeDifferenceY () {
      return this.totalHeight / this.previewSize
    }
  },
  methods: {
    ...mapActions({
      setPreviewViewport: 'drawer/setPreviewViewport'
    }),
    drawUpdated (dataURL) {
      const img = new Image()

      img.onload = () => {
        const w1 = this.width
        const h1 = this.height
        const w2 = this.previewSize
        const h2 = this.previewSize

        this.previewContext.clearRect(0, 0, w2, h2)
        this.previewContext.drawImage(img, 0, 0, w1, h1, 0, 0, w2, h2)
      }

      img.src = dataURL
    },
    moveViewportArea (event) {
      const { left, top } = event.target.getBoundingClientRect()

      const maximumLeft = this.previewSize - this.viewportAreaWidth / 2
      const maximumTop = this.previewSize - this.viewportAreaHeight / 2

      const initialLeft = Math.max(
        this.viewportAreaWidth / 2,
        Math.min(event.clientX - left, maximumLeft)
      )

      const initialTop = Math.max(
        this.viewportAreaHeight / 2,
        Math.min(event.clientY - top, maximumTop)
      )

      this.viewportAreaLeft = initialLeft - this.viewportAreaWidth / 2
      this.viewportAreaTop = initialTop - this.viewportAreaHeight / 2

      this.dragViewportArea(event)
    },
    dragViewportArea (event) {
      const initialX = event.clientX
      const initialY = event.clientY

      const maximumX = this.previewSize - this.viewportAreaWidth
      const maximumY = this.previewSize - this.viewportAreaHeight

      let currentX = 0; let currentY = 0

      const viewport = { x: 0, y: 0 }

      this.movingPreview = true

      const mousemove = (event) => {
        currentX = event.clientX - initialX
        currentY = event.clientY - initialY

        currentX += this.viewportAreaLeft
        currentY += this.viewportAreaTop

        currentX = Math.max(0, Math.min(currentX, maximumX))
        currentY = Math.max(0, Math.min(currentY, maximumY))

        this.$refs.viewportArea.style.left = currentX + 'px'
        this.$refs.viewportArea.style.top = currentY + 'px'

        viewport.x = currentX * this.sizeDifferenceX
        viewport.y = currentY * this.sizeDifferenceY

        this.setPreviewViewport(viewport)
      }

      mousemove(event)

      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)

        this.viewportAreaLeft = currentX
        this.viewportAreaTop = currentY

        this.movingPreview = false
      }

      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    },
    setPreviewWidth (newWidth) {
      const viewportArea = this.$refs.viewportArea

      const width = newWidth / this.sizeDifferenceX

      this.viewportAreaWidth = Math.min(this.previewSize, width)

      viewportArea.style.width = this.viewportAreaWidth + 'px'
    },
    setPreviewHeight (newHeight) {
      const viewportArea = this.$refs.viewportArea

      const height = newHeight / this.sizeDifferenceY

      this.viewportAreaHeight = Math.min(this.previewSize, height)

      viewportArea.style.height = this.viewportAreaHeight + 'px'
    }
  },
  mounted () {
    const preview = this.$refs.preview

    preview.width = this.previewSize
    preview.height = this.previewSize

    this.previewContext = preview.getContext('2d')
    this.previewContext.imageSmoothingEnabled = false

    if (this.dataURL !== null) {
      this.drawUpdated(this.dataURL)
    }
  },
  watch: {
    dataURL (newDataURL) {
      this.drawUpdated(newDataURL)
    },
    'drawerViewport.x' (newX) {
      if (!this.movingPreview && Number.isFinite(newX)) {
        const viewportArea = this.$refs.viewportArea
        const x = Math.max(0, newX)

        this.viewportAreaLeft = x / this.sizeDifferenceX

        viewportArea.style.left = this.viewportAreaLeft + 'px'

        this.setPreviewViewport({ x })
      }
    },
    'drawerViewport.y' (newY) {
      if (!this.movingPreview && Number.isFinite(newY)) {
        const viewportArea = this.$refs.viewportArea
        const y = Math.max(0, newY)

        this.viewportAreaTop = y / this.sizeDifferenceY

        viewportArea.style.top = this.viewportAreaTop + 'px'

        this.setPreviewViewport({ y })
      }
    },
    'drawerViewport.width' (newWidth) {
      this.setPreviewWidth(newWidth)

      this.showViewportArea =
        this.viewportAreaWidth < this.previewSize ||
        this.viewportAreaHeight < this.previewSize
    },
    'drawerViewport.height' (newHeight) {
      this.setPreviewHeight(newHeight)

      this.showViewportArea =
        this.viewportAreaWidth < this.previewSize ||
        this.viewportAreaHeight < this.previewSize
    },
    scale () {
      this.setPreviewWidth(this.drawerViewport.width)
      this.setPreviewHeight(this.drawerViewport.height)

      this.showViewportArea =
        this.viewportAreaWidth < this.previewSize ||
        this.viewportAreaHeight < this.previewSize
    }
  }
})
</script>

<style lang="scss" scoped>
  .viewport {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    background-color: $background-color;
    border: 1px solid $text-color;
    box-sizing: border-box;
  }

  .viewport__preview {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .viewport__background {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .viewport__area {
    position: absolute;
    background-color: $selected-color;
    opacity: 0.6;
    cursor: move;
    left: 0px;
    top: 0px;
  }
</style>
