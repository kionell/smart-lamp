<template>
  <div
    id="line-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 528 528" width="60" height="60">
      <path d="M506.143,5.859c-7.811-7.811-20.475-7.811-28.285,0l-472,472c-7.811,7.811-7.811,20.474,0,28.284c3.905,3.906,9.024,5.858,14.142,5.858s10.237-1.953,14.143-5.858l472-472C513.954,26.333,513.954,13.67,506.143,5.859z" fill="#FFFFFF" stroke="#000000" stroke-width="16"/>
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
      operation: 'line',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii04IC04IDUyOCA1MjgiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PHBhdGggZD0iTTUwNi4xNDMgNS44NTljLTcuODExLTcuODExLTIwLjQ3NS03LjgxMS0yOC4yODUgMGwtNDcyIDQ3MmMtNy44MTEgNy44MTEtNy44MTEgMjAuNDc0IDAgMjguMjg0IDMuOTA1IDMuOTA2IDkuMDI0IDUuODU4IDE0LjE0MiA1Ljg1OHMxMC4yMzctMS45NTMgMTQuMTQzLTUuODU4bDQ3Mi00NzJjNy44MTEtNy44MSA3LjgxMS0yMC40NzMgMC0yOC4yODR6IiBmaWxsPSIjRkZGIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMTYiLz48L3N2Zz4=") 0 26, default'
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
    lockProportions (startX, startY, endX, endY) {
      const diffX = Math.abs(endX - startX)
      const diffY = Math.abs(endY - startY)

      const signX = endX - startX < 0 ? -1 : 1
      const signY = endY - startY < 0 ? -1 : 1

      const max = Math.max(diffX, diffY)
      const min = Math.min(diffX, diffY)

      const delta = max - min <= max / 2 ? max : 0

      let x = signX * delta
      let y = signY * delta

      if (x === 0 && diffX === max) x = endX
      if (y === 0 && diffY === max) y = endY

      if (diffX === min || delta === max) x += startX
      if (diffY === min || delta === max) y += startY

      return { x, y }
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

          isDrawn = this.drawLine(prevX, prevY, currX, currY, color)

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
