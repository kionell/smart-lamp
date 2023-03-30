<template>
  <div
    id="eraser-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469 469" width="60" height="60">
      <path d="M457 162L318 23c-8-8-19-12-31-12-11 0-21 4-29 12L13 269a42 42 0 000 60l114 114c10 10 23 16 37 16h34c14 0 28-6 38-16l221-221a42 42 0 000-60z" fill="#000000"/>
      <path d="M221 428c-6 6-14 9-23 9h-34c-8 0-16-3-22-9L28 314a21 21 0 010-30l94-95 169 169-70 70z" fill="#f2f2f2"/>
      <path d="M442 207L306 343 137 174 273 38a21 21 0 0130 0l139 139a21 21 0 010 30z" fill="#0288d1"/>
      <path d="M221 428c-6 6-14 9-23 9h-34c-8 0-16-3-22-9L28 314a21 21 0 010-30l94-95 169 169-70 70z" fill="#f2f2f2"/>
      <path d="M245 349a85 85 0 01-60 24h-8c-22 0-44-9-59-24l-78-78-12 13a21 21 0 000 30l114 114c6 6 14 9 22 9h34c9 0 17-3 23-9l70-70-28-28-18 19zM429 164L278 315l28 28 136-136a21 21 0 000-30l-13-13z" opacity=".1"/>
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
      operation: 'eraser',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NjkgNDY5IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxwYXRoIGQ9Ik00NTcgMTYyTDMxOCAyM2MtOC04LTE5LTEyLTMxLTEyLTExIDAtMjEgNC0yOSAxMkwxMyAyNjlhNDIgNDIgMCAwMDAgNjBsMTE0IDExNGMxMCAxMCAyMyAxNiAzNyAxNmgzNGMxNCAwIDI4LTYgMzgtMTZsMjIxLTIyMWE0MiA0MiAwIDAwMC02MHoiLz48cGF0aCBkPSJNMjIxIDQyOGMtNiA2LTE0IDktMjMgOWgtMzRjLTggMC0xNi0zLTIyLTlMMjggMzE0YTIxIDIxIDAgMDEwLTMwbDk0LTk1IDE2OSAxNjktNzAgNzB6IiBmaWxsPSIjZjJmMmYyIi8+PHBhdGggZD0iTTQ0MiAyMDdMMzA2IDM0MyAxMzcgMTc0IDI3MyAzOGEyMSAyMSAwIDAxMzAgMGwxMzkgMTM5YTIxIDIxIDAgMDEwIDMweiIgZmlsbD0iIzAyODhkMSIvPjxwYXRoIGQ9Ik0yMjEgNDI4Yy02IDYtMTQgOS0yMyA5aC0zNGMtOCAwLTE2LTMtMjItOUwyOCAzMTRhMjEgMjEgMCAwMTAtMzBsOTQtOTUgMTY5IDE2OS03MCA3MHoiIGZpbGw9IiNmMmYyZjIiLz48cGF0aCBkPSJNMjQ1IDM0OWE4NSA4NSAwIDAxLTYwIDI0aC04Yy0yMiAwLTQ0LTktNTktMjRsLTc4LTc4LTEyIDEzYTIxIDIxIDAgMDAwIDMwbDExNCAxMTRjNiA2IDE0IDkgMjIgOWgzNGM5IDAgMTctMyAyMy05bDcwLTcwLTI4LTI4LTE4IDE5em0xODQtMTg1TDI3OCAzMTVsMjggMjggMTM2LTEzNmEyMSAyMSAwIDAwMC0zMGwtMTMtMTN6IiBvcGFjaXR5PSIuMSIvPjwvc3ZnPg==") 8 26, default'
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
    setPixel (x, y) {
      if (x < this.minX || y < this.minY || x >= this.maxX || y >= this.maxY) {
        return false
      }

      const imageData = this.context.getImageData(x, y, 1, 1)
      const d = imageData.data

      if ((d[0] + d[1] + d[2] + d[3]) === 0) {
        return false
      }

      imageData.data[0] = 0
      imageData.data[1] = 0
      imageData.data[2] = 0
      imageData.data[3] = 0

      this.context.putImageData(imageData, x, y)

      return true
    },
    drawLine (x0, y0, x1, y1) {
      let isDrawn = 0

      const dx = Math.abs(x1 - x0)
      const dy = Math.abs(y1 - y0)

      const sx = x0 < x1 ? 1 : -1
      const sy = y0 < y1 ? 1 : -1

      let err = (dx > dy ? dx : -dy) / 2

      while (true) {
        isDrawn |= this.setPixel(x0, y0)

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

      const mousemove = (e) => {
        if (!e.target.contains(this.showContext.canvas)) return

        const { x: currX, y: currY } = this.getCoordinates(e)

        isDrawn |= this.drawLine(prevX, prevY, currX, currY)

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
