<template>
  <div
    id="ellipse-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 528 528" width="60" height="60">
      <ellipse cx="256" cy="256" rx="256" ry="256" fill="#FFFFFF" stroke="#000000" stroke-width="16"/>
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
      operation: 'ellipse',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii04IC04IDUyOCA1MjgiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiBmaWxsPSIjRkZGIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMTYiIHI9IjI1NiIvPjwvc3ZnPg==") 3 3, default'
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
    setEllipsePoints (xc, yc, x, y, color) {
      let isDrawn = 0

      isDrawn |= this.setPixel(xc + x, yc + y, color)
      isDrawn |= this.setPixel(xc - x, yc + y, color)
      isDrawn |= this.setPixel(xc + x, yc - y, color)
      isDrawn |= this.setPixel(xc - x, yc - y, color)

      return isDrawn
    },
    drawEllipse (xc, yc, rx, ry, color) {
      let dx, dy, d1, d2, x, y
      let isDrawn = 0

      x = 0
      y = ry

      // Initial decision parameter of region 1
      d1 = (ry * ry) - (rx * rx * ry) + (0.25 * rx * rx)
      dx = 2 * ry * ry * x
      dy = 2 * rx * rx * y

      // For region 1
      while (dx < dy) {
        // Print points based on 4-way symmetry
        isDrawn |= this.setEllipsePoints(xc, yc, x, y, color)

        // Checking and updating value of
        // decision parameter based on algorithm
        if (d1 < 0) {
          x++
          dx = dx + (2 * ry * ry)
          d1 = d1 + dx + (ry * ry)
        } else {
          x++
          y--
          dx = dx + (2 * ry * ry)
          dy = dy - (2 * rx * rx)
          d1 = d1 + dx - dy + (ry * ry)
        }
      }

      // Decision parameter of region 2
      d2 = ((ry * ry) * ((x + 0.5) * (x + 0.5))) +
            ((rx * rx) * ((y - 1) * (y - 1))) -
              (rx * rx * ry * ry)

      // Plotting points of region 2
      while (y >= 0) {
        // Print points based on 4-way symmetry
        isDrawn |= this.setEllipsePoints(xc, yc, x, y, color)

        // Checking and updating parameter
        // value based on algorithm
        if (d2 > 0) {
          y--
          dy = dy - (2 * rx * rx)
          d2 = d2 + (rx * rx) - dy
        } else {
          y--
          x++
          dx = dx + (2 * ry * ry)
          dy = dy - (2 * rx * rx)
          d2 = d2 + dx - dy + (rx * rx)
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

          const { x: currX, y: currY } = this.getCoordinates(e)

          let a = Math.abs(currX - prevX)
          let b = Math.abs(prevY - currY)

          if (e.shiftKey) {
            b = a = Math.max(a, b)
          }

          isDrawn = this.drawEllipse(prevX, prevY, a, b, color)

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
