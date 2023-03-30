<template>
  <div
    id="pencil-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469 469" width="60" height="60">
      <path d="M457 76l-64-64a44 44 0 00-61 0L46 302l-3 4L0 456a11 11 0 0014 13l149-43 5-2 289-287a42 42 0 000-61z" fill="#000000"/>
      <g fill="#ffca28">
        <path d="M120 334l-15-29c-1-4-5-6-9-6H79L286 90l39 39-205 205zM165 364l-30-15 205-205 40 39-209 207v-17c0-4-3-7-6-9z"/>
      </g>
      <path d="M348 28c8-8 22-8 30 0l64 64a21 21 0 010 30l-47 46-94-93 47-47z" fill="#d32f2f"/>
      <path d="M113 362l-5-5-19-37H61l-23 83 29 28 82-23v-28l-36-18z" fill="#f2f2f2"/>
      <path fill="#666666" d="M67 431l-29-28 2-8-14 48 49-14z"/>
      <path d="M149 380l-36-18-3-3-84 84 123-35v-28zM410 60l-62 62 47 46 47-46a21 21 0 000-30l-32-32zM165 364l-30-15 205-205 40 39-209 207v-17c0-4-3-7-6-9z" opacity=".1"/>
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
      operation: 'pencil',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NjkgNDY5IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxwYXRoIGQ9Ik00NTcgNzZsLTY0LTY0YTQ0IDQ0IDAgMDAtNjEgMEw0NiAzMDJsLTMgNEwwIDQ1NmExMSAxMSAwIDAwMTQgMTNsMTQ5LTQzIDUtMiAyODktMjg3YTQyIDQyIDAgMDAwLTYxeiIvPjxwYXRoIGQ9Ik0xMjAgMzM0bC0xNS0yOWMtMS00LTUtNi05LTZINzlMMjg2IDkwbDM5IDM5LTIwNSAyMDV6bTQ1IDMwbC0zMC0xNSAyMDUtMjA1IDQwIDM5LTIwOSAyMDd2LTE3YzAtNC0zLTctNi05eiIgZmlsbD0iI2ZmY2EyOCIvPjxwYXRoIGQ9Ik0zNDggMjhjOC04IDIyLTggMzAgMGw2NCA2NGEyMSAyMSAwIDAxMCAzMGwtNDcgNDYtOTQtOTMgNDctNDd6IiBmaWxsPSIjZDMyZjJmIi8+PHBhdGggZD0iTTExMyAzNjJsLTUtNS0xOS0zN0g2MWwtMjMgODMgMjkgMjggODItMjN2LTI4bC0zNi0xOHoiIGZpbGw9IiNmMmYyZjIiLz48cGF0aCBmaWxsPSIjNjY2IiBkPSJNNjcgNDMxbC0yOS0yOCAyLTgtMTQgNDggNDktMTR6Ii8+PHBhdGggZD0iTTE0OSAzODBsLTM2LTE4LTMtMy04NCA4NCAxMjMtMzV2LTI4ek00MTAgNjBsLTYyIDYyIDQ3IDQ2IDQ3LTQ2YTIxIDIxIDAgMDAwLTMwbC0zMi0zMnpNMTY1IDM2NGwtMzAtMTUgMjA1LTIwNSA0MCAzOS0yMDkgMjA3di0xN2MwLTQtMy03LTYtOXoiIG9wYWNpdHk9Ii4xIi8+PC9zdmc+") 0 26, default'
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
    drawLine (x0, y0, x1, y1, color) {
      let isDrawn = 0

      const dx = Math.abs(x1 - x0)
      const dy = Math.abs(y1 - y0)

      const sx = x0 < x1 ? 1 : -1
      const sy = y0 < y1 ? 1 : -1

      let err = (dx > dy ? dx : -dy) / 2

      while (true) {
        isDrawn |= this.setPixel(x0, y0, color)

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

      const color = event.which === 3
        ? this.secondaryRGB
        : this.mainRGB

      const mousemove = (e) => {
        if (!e.target.contains(this.showContext.canvas)) return

        const { x: currX, y: currY } = this.getCoordinates(e)

        isDrawn |= this.drawLine(prevX, prevY, currX, currY, color)

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
