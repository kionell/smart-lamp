<template>
  <div
    id="bucket-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469 469" width="60" height="60">
      <path d="M427 229c1-30-34-87-88-141C286 35 230 0 199 0h-1c-8 0-15 3-20 8v1l-28 34C97 45 21 83 21 139c0 17 8 30 18 41L7 220c-3 3-7 8-7 17-1 26 27 72 73 117 44 44 89 73 115 73h1c9 0 14-4 17-6l212-172 1-1c5-4 7-11 8-19zM53 163c-6-6-10-14-10-24 0-36 46-64 88-72l-78 96z" fill="#000000"/>
      <path d="M174 47L70 176c24 13 56 16 69 16 23 0 38-1 54-5a21 21 0 0142 5c0 12-10 21-22 21-5 0-10-2-14-5-20 5-38 5-60 5-18 0-55-4-83-20l-33 41-2 4c0 16 23 57 67 101 43 43 84 66 100 66h3l189-152c-35-11-82-46-121-85s-75-86-85-121z" fill="#78909c"/>
      <path d="M353 241L185 373h-3c-17 0-57-22-101-64-29-28-48-55-58-74-1 1-2 1-2 3 0 16 23 57 67 101 43 43 84 66 100 66h3l189-152-27-12z" opacity=".1"/>
      <path d="M323 103c-54-54-103-82-124-82-2 0-4 0-5 2h-1c-8 9 13 62 81 130 68 67 121 88 130 80l1-5c1-20-27-70-82-125z" fill="#7cb342"/>
      <path d="M204 55l6-2c21 0 70 28 124 82 35 35 59 68 71 92 0-20-28-70-82-124S220 21 199 21c-2 0-4 0-5 2h-1c-3 4-1 17 9 37l2-5z" opacity=".1"/>
      <path d="M425 325c-4-6-14-6-18 0-7 10-44 65-44 91a53 53 0 00106 0c0-26-37-81-44-91z" fill="#000000"/>
      <path d="M416 448c-18 0-32-14-32-32 0-12 17-42 32-66 15 24 32 54 32 66 0 18-14 32-32 32z" fill="#7cb342"/>
      <path d="M421 358c7 14 12 26 12 32a32 32 0 01-49 27 32 32 0 0064-1c0-10-13-35-27-58z" opacity="0.1"/>
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
      operation: 'bucket',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NjkgNDY5IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxwYXRoIGQ9Ik00MjcgMjI5YzEtMzAtMzQtODctODgtMTQxQzI4NiAzNSAyMzAgMCAxOTkgMGgtMWMtOCAwLTE1IDMtMjAgOHYxbC0yOCAzNEM5NyA0NSAyMSA4MyAyMSAxMzljMCAxNyA4IDMwIDE4IDQxTDcgMjIwYy0zIDMtNyA4LTcgMTctMSAyNiAyNyA3MiA3MyAxMTcgNDQgNDQgODkgNzMgMTE1IDczaDFjOSAwIDE0LTQgMTctNmwyMTItMTcyIDEtMWM1LTQgNy0xMSA4LTE5ek01MyAxNjNjLTYtNi0xMC0xNC0xMC0yNCAwLTM2IDQ2LTY0IDg4LTcybC03OCA5NnoiLz48cGF0aCBkPSJNMTc0IDQ3TDcwIDE3NmMyNCAxMyA1NiAxNiA2OSAxNiAyMyAwIDM4LTEgNTQtNWEyMSAyMSAwIDAxNDIgNWMwIDEyLTEwIDIxLTIyIDIxLTUgMC0xMC0yLTE0LTUtMjAgNS0zOCA1LTYwIDUtMTggMC01NS00LTgzLTIwbC0zMyA0MS0yIDRjMCAxNiAyMyA1NyA2NyAxMDEgNDMgNDMgODQgNjYgMTAwIDY2aDNsMTg5LTE1MmMtMzUtMTEtODItNDYtMTIxLTg1cy03NS04Ni04NS0xMjF6IiBmaWxsPSIjNzg5MDljIi8+PHBhdGggZD0iTTM1MyAyNDFMMTg1IDM3M2gtM2MtMTcgMC01Ny0yMi0xMDEtNjQtMjktMjgtNDgtNTUtNTgtNzQtMSAxLTIgMS0yIDMgMCAxNiAyMyA1NyA2NyAxMDEgNDMgNDMgODQgNjYgMTAwIDY2aDNsMTg5LTE1Mi0yNy0xMnoiIG9wYWNpdHk9Ii4xIi8+PHBhdGggZD0iTTMyMyAxMDNjLTU0LTU0LTEwMy04Mi0xMjQtODItMiAwLTQgMC01IDJoLTFjLTggOSAxMyA2MiA4MSAxMzAgNjggNjcgMTIxIDg4IDEzMCA4MGwxLTVjMS0yMC0yNy03MC04Mi0xMjV6IiBmaWxsPSIjN2NiMzQyIi8+PHBhdGggZD0iTTIwNCA1NWw2LTJjMjEgMCA3MCAyOCAxMjQgODIgMzUgMzUgNTkgNjggNzEgOTIgMC0yMC0yOC03MC04Mi0xMjRTMjIwIDIxIDE5OSAyMWMtMiAwLTQgMC01IDJoLTFjLTMgNC0xIDE3IDkgMzdsMi01eiIgb3BhY2l0eT0iLjEiLz48cGF0aCBkPSJNNDI1IDMyNWMtNC02LTE0LTYtMTggMC03IDEwLTQ0IDY1LTQ0IDkxYTUzIDUzIDAgMDAxMDYgMGMwLTI2LTM3LTgxLTQ0LTkxeiIvPjxwYXRoIGQ9Ik00MTYgNDQ4Yy0xOCAwLTMyLTE0LTMyLTMyIDAtMTIgMTctNDIgMzItNjYgMTUgMjQgMzIgNTQgMzIgNjYgMCAxOC0xNCAzMi0zMiAzMnoiIGZpbGw9IiM3Y2IzNDIiLz48cGF0aCBkPSJNNDIxIDM1OGM3IDE0IDEyIDI2IDEyIDMyYTMyIDMyIDAgMDEtNDkgMjcgMzIgMzIgMCAwMDY0LTFjMC0xMC0xMy0zNS0yNy01OHoiIG9wYWNpdHk9Ii4xIi8+PC9zdmc+") 25 27, default'
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
    mainRGBA () {
      return (this.mainColor + 'FF')
        .replace('#', '')
        .match(/.{1,2}/g)
        .map(c => parseInt(c, 16))
    },
    secondaryRGBA () {
      return (this.secondaryColor + 'FF')
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
    getColorAtPixel (imageData, x, y) {
      const { width, data } = imageData

      return [
        data[4 * (width * y + x) + 0],
        data[4 * (width * y + x) + 1],
        data[4 * (width * y + x) + 2],
        data[4 * (width * y + x) + 3]
      ]
    },
    setColorAtPixel (imageData, color, x, y) {
      const { width, data } = imageData

      data[4 * (width * y + x) + 0] = color[0] & 0xff
      data[4 * (width * y + x) + 1] = color[1] & 0xff
      data[4 * (width * y + x) + 2] = color[2] & 0xff
      data[4 * (width * y + x) + 3] = color[3] & 0xff
    },
    colorMatch (a, b) {
      return a[0] === b[0] && a[1] === b[1] &&
        a[2] === b[2] && a[3] === b[3]
    },
    floodFill (imageData, newColor, x, y) {
      const { width, height } = imageData

      const baseColor = this.getColorAtPixel(imageData, x, y)
      const stack = []

      let operator = { x, y }
      let color

      // Check if base color and new color are the same
      if (this.colorMatch(baseColor, newColor)) return false

      // Add the clicked location to stack
      stack.push({ x: operator.x, y: operator.y })

      while (stack.length) {
        operator = stack.pop()

        let contiguousDown = true // Vertical is assumed to be true
        let contiguousUp = true // Vertical is assumed to be true
        let contiguousLeft = false
        let contiguousRight = false

        // Move to top most contiguousDown pixel
        while (contiguousUp && operator.y >= 0) {
          operator.y--

          color = this.getColorAtPixel(imageData, operator.x, operator.y)
          contiguousUp = this.colorMatch(color, baseColor)
        }

        operator.y++

        // Move downward
        while (contiguousDown && operator.y < height) {
          this.setColorAtPixel(imageData, newColor, operator.x, operator.y)

          // Check left
          color = this.getColorAtPixel(imageData, operator.x - 1, operator.y)

          if (operator.x - 1 >= 0 && this.colorMatch(color, baseColor)) {
            if (!contiguousLeft) {
              contiguousLeft = true
              stack.push({ x: operator.x - 1, y: operator.y })
            }
          } else {
            contiguousLeft = false
          }

          // Check right
          color = this.getColorAtPixel(imageData, operator.x + 1, operator.y)

          if (operator.x + 1 < width && this.colorMatch(color, baseColor)) {
            if (!contiguousRight) {
              stack.push({ x: operator.x + 1, y: operator.y })
              contiguousRight = true
            }
          } else {
            contiguousRight = false
          }

          operator.y++

          color = this.getColorAtPixel(imageData, operator.x, operator.y)
          contiguousDown = this.colorMatch(color, baseColor)
        }
      }

      return true
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
      const { x, y } = this.getCoordinates(event)

      if (x < this.minX || y < this.minY || x >= this.maxX || y >= this.maxY) {
        return false
      }

      const imgData = this.context.getImageData(
        this.minX, this.minY,
        this.maxX - this.minX,
        this.maxY - this.minY
      )

      const newColor = event.which === 3
        ? this.secondaryRGBA
        : this.mainRGBA

      const isDrawn = this.floodFill(
        imgData,
        newColor,
        x - this.minX,
        y - this.minY
      )

      if (isDrawn) {
        this.context.putImageData(imgData, this.minX, this.minY)
        this.setCurrentDataURL(this.context.canvas.toDataURL())

        const version = {
          operation: this.operation,
          dataURL: this.context.canvas.toDataURL()
        }

        this.$emit('endDrawing', version)
      }
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
