<template>
  <div
    id="select-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 528 528" width="60" height="60">
      <path d="M138 472h90v40h-90zM284 472h90v40h-90zM61 472c-12 0-21-10-21-21v-20H0v20c0 33 27 61 61 61h20v-40H61zM471 431v20c0 11-9 21-21 21h-20v40h20c34 0 61-28 61-61v-20h-40zM138 1h90v40h-90zM284 1h90v40h-90zM61 0C27 0 0 28 0 61v20h40V61c0-11 9-21 21-21h20V0H61zM450 0h-20v40h20c12 0 21 10 21 21v20h40V61c0-33-27-61-61-61zM0 289h40v90H0zM0 143h40v90H0zM472 289h40v90h-40zM472 143h40v90h-40z" stroke="#000000" stroke-width="16" fill="#ffffff"/>
    </svg>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  emits: [
    'selectTool'
  ],
  data () {
    return {
      operation: 'select',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii04IC04IDUyOCA1MjgiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PHBhdGggZD0iTTEzOCA0NzJoOTB2NDBoLTkwem0xNDYgMGg5MHY0MGgtOTB6bS0yMjMgMGMtMTIgMC0yMS0xMC0yMS0yMXYtMjBIMHYyMGMwIDMzIDI3IDYxIDYxIDYxaDIwdi00MEg2MXptNDEwLTQxdjIwYzAgMTEtOSAyMS0yMSAyMWgtMjB2NDBoMjBjMzQgMCA2MS0yOCA2MS02MXYtMjBoLTQwek0xMzggMWg5MHY0MGgtOTB6bTE0NiAwaDkwdjQwaC05MHpNNjEgMEMyNyAwIDAgMjggMCA2MXYyMGg0MFY2MWMwLTExIDktMjEgMjEtMjFoMjBWMEg2MXptMzg5IDBoLTIwdjQwaDIwYzEyIDAgMjEgMTAgMjEgMjF2MjBoNDBWNjFjMC0zMy0yNy02MS02MS02MXpNMCAyODloNDB2OTBIMHptMC0xNDZoNDB2OTBIMHptNDcyIDE0Nmg0MHY5MGgtNDB6bTAtMTQ2aDQwdjkwaC00MHoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxNiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==") 1 1, default'
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
      width: 'drawer/getWidth',
      height: 'drawer/getHeight',
      isLimited: 'drawer/isLimited',
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
      setBoundaries: 'drawer/setBoundaries',
      enableLimits: 'drawer/enableLimits'
    }),
    getRawCoords (event) {
      const target = event.target
      const canvas = this.showContext.canvas
      const drawingArea = canvas.offsetParent

      let fullX = event.offsetX
      let fullY = event.offsetY

      if (target === canvas) {
        fullX += drawingArea.offsetLeft
        fullY += drawingArea.offsetTop
      }

      return {
        x: fullX - drawingArea.offsetLeft - 1,
        y: fullY - drawingArea.offsetTop - 1
      }
    },
    getCoordinates (event) {
      const { x: relativeX, y: relativeY } = this.getRawCoords(event)

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
      const { x: rawPrevX, y: rawPrevY } = this.getRawCoords(event)

      const initialMinX = this.minX
      const initialMaxX = this.maxX
      const initialMinY = this.minY
      const initialMaxY = this.maxY
      const initialLimit = this.isLimited

      let x1, x2, y1, y2

      const mousemove = (e) => {
        if (!e.target.contains(this.showContext.canvas)) return

        const coords = this.getCoordinates(e)
        const raw = this.getRawCoords(e)

        const diffX = Math.abs(raw.x - rawPrevX) > this.sizeDifference / 10
        const diffY = Math.abs(raw.y - rawPrevY) > this.sizeDifference / 10

        const isSelected = initialLimit &&
          prevX >= initialMinX && prevX <= initialMaxX &&
          prevY >= initialMinY && prevY <= initialMaxY

        if (!isSelected) {
          x1 = 0; x2 = this.width
          y1 = 0; y2 = this.height

          if (diffX || diffY) {
            x1 = prevX; y1 = prevY
            x2 = coords.x; y2 = coords.y

            if (x1 > x2) [x1, x2] = [x2, x1]
            if (y1 > y2) [y1, y2] = [y2, y1]

            x1 = Math.max(0, Math.min(x1, this.width))
            y1 = Math.max(0, Math.min(y1, this.height))
            x2 = Math.max(0, Math.min(x2 + 1, this.width))
            y2 = Math.max(0, Math.min(y2 + 1, this.height))

            if (e.shiftKey) {
              const locked = this.lockProportions(x1, y1, x2, y2)

              if (prevX > coords.x) x1 += x2 - locked.x
              if (prevY > coords.y) y1 += y2 - locked.y
              if (prevX < coords.x) x2 = locked.x
              if (prevY < coords.y) y2 = locked.y
            }
          }

          this.enableLimits(diffX || diffY)
        } else {
          x1 = initialMinX + coords.x - prevX
          x2 = initialMaxX + coords.x - prevX
          y1 = initialMinY + coords.y - prevY
          y2 = initialMaxY + coords.y - prevY
        }

        const boundaries = {
          startX: x1,
          startY: y1,
          endX: x2,
          endY: y2
        }

        this.setBoundaries(boundaries)
      }

      mousemove(event)

      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
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
