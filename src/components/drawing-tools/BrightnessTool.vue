<template>
  <div
    id="brightness-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="-8 -8 528 528">
      <defs>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="512" height="80">
          <rect width="512" height="40" y="0" fill="#FFFFFF"/>
          <rect width="512" height="40" y="40" fill="#1B1B1B"/>
        </pattern>
        <pattern id="halves" patternUnits="userSpaceOnUse" width="512" height="512">
          <rect width="512" height="512" x="0" fill="#1B1B1B"/>
          <rect width="512" height="512" x="256" fill="url(#stripes)"/>
        </pattern>
      </defs>
      <ellipse cx="256" cy="256" rx="256" ry="256" fill="url(#halves)" stroke="#000000" stroke-width="16"/>
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
      drawnPixels: [],
      operation: 'brightness',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iLTggLTggNTI4IDUyOCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI1MTIiIGhlaWdodD0iODAiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBoNTEydjQwSDB6Ii8+PHBhdGggZmlsbD0iIzFCMUIxQiIgZD0iTTAgNDBoNTEydjQwSDB6Ii8+PC9wYXR0ZXJuPjxwYXR0ZXJuIGlkPSJiIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PHBhdGggZmlsbD0iIzFCMUIxQiIgZD0iTTAgMGg1MTJ2NTEySDB6Ii8+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTI1NiAwaDUxMnY1MTJIMjU2eiIvPjwvcGF0dGVybj48L2RlZnM+PGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiBmaWxsPSJ1cmwoI2IpIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMTYiIHI9IjI1NiIvPjwvc3ZnPg==") 3 3, default'
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
      scale: 'drawer/getScale'
    }),
    translation () {
      return this.$t(this.operation)
    },
    sizeDifference () {
      return this.scale * this.pixelSize
    },
    width () {
      return this.context.canvas.width
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
    }
  },
  methods: {
    ...mapActions({
      setCurrentTool: 'drawer/setCurrentTool',
      setCurrentDataURL: 'drawer/setCurrentDataURL'
    }),
    setPixel (x, y, lighten = true) {
      if (x < this.minX || y < this.minY || x >= this.maxX || y >= this.maxY) {
        return false
      }

      const pos = this.width * y + x

      if (this.drawnPixels[pos]) return false

      const imageData = this.context.getImageData(x, y, 1, 1)
      const data = imageData.data

      if (data[3] === 0) return false

      data[0] += (lighten ? 26 : -26)
      data[1] += (lighten ? 26 : -26)
      data[2] += (lighten ? 26 : -26)

      this.context.putImageData(imageData, x, y)

      this.drawnPixels[pos] = true

      return true
    },
    drawLine (x0, y0, x1, y1, lighten = true) {
      let isDrawn = 0

      const dx = Math.abs(x1 - x0)
      const dy = Math.abs(y1 - y0)

      const sx = x0 < x1 ? 1 : -1
      const sy = y0 < y1 ? 1 : -1

      let err = (dx > dy ? dx : -dy) / 2

      while (true) {
        isDrawn |= this.setPixel(x0, y0, lighten)

        if (x0 === x1 && y0 === y1) break

        const e2 = err

        if (e2 > -dx) {
          err -= dy
          x0 += sx
        }

        if (e2 < dy) {
          err += dx
          y0 += sy
        }
      }

      return !!isDrawn
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
      let { x: prevX, y: prevY } = this.getCoordinates(event)

      let isDrawn = false

      const lighten = event.which === 3

      const mousemove = (e) => {
        if (!e.target.contains(this.showContext.canvas)) return

        const { x: currX, y: currY } = this.getCoordinates(e)

        isDrawn |= this.drawLine(prevX, prevY, currX, currY, lighten)

        prevX = currX; prevY = currY

        if (isDrawn) {
          this.setCurrentDataURL(this.context.canvas.toDataURL())
        }
      }

      mousemove(event)

      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)

        if (!isDrawn) return

        this.drawnPixels = []

        const version = {
          operation: this.operation,
          dataURL: this.context.canvas.toDataURL()
        }

        this.$emit('endDrawing', version)
      }

      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
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
