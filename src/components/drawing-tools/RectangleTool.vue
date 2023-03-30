<template>
  <div
    id="rectangle-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 528 528" width="60" height="60">
      <rect width="512" height="512" fill="#FFFFFF" stroke="#000000" stroke-width="16"/>
    </svg>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  emits: [
    'selectTool',
    'endDrawing'
  ],
  data () {
    return {
      operation: 'rectangle',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii04IC04IDUyOCA1MjgiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PHBhdGggZmlsbD0iI0ZGRiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjE2IiBkPSJNMCAwaDUxMnY1MTJIMHoiLz48L3N2Zz4=") 0 0, default'
    }
  },
  props: {
    id: {
      type: Number,
      default: -1
    }
  },
  computed: {
    ...mapGetters({
      toolID: 'drawer/getCurrentTool',
      context: 'drawer/getCurrentContext',
      boundaries: 'drawer/getBoundaries',
      showContext: 'drawer/getShowContext',
      pixelSize: 'drawer/getPixelSize',
      scale: 'drawer/getScale',
      mainColor: 'colors/getMainColor',
      secondaryColor: 'colors/getSecondaryColor'
    }),
    translation () {
      return this.$t(this.operation)
    },
    sizeDifference () {
      return this.scale * this.pixelSize
    },
    minX () {
      return this.boundaries.startX
    },
    minY () {
      return this.boundaries.startY
    },
    maxX () {
      return this.boundaries.endX
    },
    maxY () {
      return this.boundaries.endY
    },
    mainRGB () {
      return this.mainColor
        .replace('#', '')
        .match(/.{1,2}/g)
        .map(c => parseInt(c, 16))
    },
    secondaryRGB () {
      return this.secondaryColor
        .replace('#', '')
        .match(/.{1,2}/g)
        .map(c => parseInt(c, 16))
    }
  },
  methods: {
    ...mapActions({
      setCurrentTool: 'drawer/setCurrentTool',
      setCurrentDataURL: 'drawer/setCurrentDataURL'
    }),
    setPixel (x, y, c) {
      if (x < this.minX || y < this.minY || x >= this.maxX || y >= this.maxY) {
        return false
      }

      const imageData = this.context.getImageData(x, y, 1, 1)
      const d = imageData.data

      if (d[0] === c[0] && d[1] === c[1] && d[2] === c[2]) {
        if (d[3] === 255) return false
      }

      imageData.data[0] = c[0]
      imageData.data[1] = c[1]
      imageData.data[2] = c[2]
      imageData.data[3] = 255

      this.context.putImageData(imageData, x, y)

      return true
    },
    drawRect (x1, y1, x2, y2, color) {
      let isDrawn = 0

      if (x1 > x2) [x1, x2] = [x2, x1]
      if (y1 > y2) [y1, y2] = [y2, y1]

      for (let x = x1; x <= x2; ++x) {
        isDrawn |= this.setPixel(x, y1, color)
      }

      if (y1 !== y2) {
        for (let x = x1; x <= x2; ++x) {
          isDrawn |= this.setPixel(x, y2, color)
        }
      }

      for (let y = y1; y <= y2; ++y) {
        isDrawn |= this.setPixel(x1, y, color)
      }

      if (x1 !== x2) {
        for (let y = y1; y <= y2; ++y) {
          isDrawn |= this.setPixel(x2, y, color)
        }
      }

      return isDrawn
    },
    getCoordinates (event) {
      const target = event.target
      const canvas = this.showContext.canvas
      const drawingArea = canvas.offsetParent

      let fullX = event.offsetX
      let fullY = event.offsetY

      if (target === canvas) {
        fullX += drawingArea.offsetLeft
        fullY += drawingArea.offsetTop
      }

      const relativeX = fullX - drawingArea.offsetLeft - 1
      const relativeY = fullY - drawingArea.offsetTop - 1

      return {
        x: Math.floor(relativeX / this.sizeDifference),
        y: Math.floor(relativeY / this.sizeDifference)
      }
    },
    lockProportions (startX, startY, endX, endY) {
      const width = Math.abs(endX - startX)
      const height = Math.abs(endY - startY)

      const max = width >= height ? width : height

      // 1st quarter
      if (endX > startX && endY < startY) {
        return {
          x: startX + max,
          y: startY - max
        }
      }

      // 2nd quarter
      if (endX < startX && endY < startY) {
        return {
          x: startX - max,
          y: startY - max
        }
      }

      // 3rd quarter
      if (endX < startX && endY > startY) {
        return {
          x: startX - max,
          y: startY + max
        }
      }

      // 4th quarter
      if (endX > startX && endY > startY) {
        return {
          x: startX + max,
          y: startY + max
        }
      }

      return { x: endX, y: endY }
    },
    execute (event) {
      const { x: prevX, y: prevY } = this.getCoordinates(event)

      let isDrawn = false

      const color = event.which === 3
        ? this.secondaryRGB
        : this.mainRGB

      const originalImage = new Image()

      originalImage.onload = () => {
        const mousemove = (e) => {
          if (!e.target.contains(this.showContext.canvas)) return

          if (isDrawn) {
            this.context.clearRect(this.minX, this.minY, this.maxX, this.maxY)
            this.context.drawImage(originalImage, 0, 0)
            this.setCurrentDataURL(this.context.canvas.toDataURL())
          }

          let { x: currX, y: currY } = this.getCoordinates(e)

          if (e.shiftKey) {
            const locked = this.lockProportions(prevX, prevY, currX, currY)

            currX = locked.x
            currY = locked.y
          }

          isDrawn = this.drawRect(prevX, prevY, currX, currY, color)

          if (isDrawn) {
            this.setCurrentDataURL(this.context.canvas.toDataURL())
          }
        }

        mousemove(event)

        const mouseup = () => {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)

          if (!isDrawn) return

          const version = {
            operation: this.operation,
            dataURL: this.context.canvas.toDataURL()
          }

          this.$emit('endDrawing', version)
        }

        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      }

      originalImage.src = this.context.canvas.toDataURL()
    }
  },
  watch: {
    toolID (newToolID) {
      if (newToolID === this.id) {
        this.$emit('selectTool', this.cursorURL)
      }
    }
  }
})
</script>
