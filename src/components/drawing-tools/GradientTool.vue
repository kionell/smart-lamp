<template>
  <div
    id="gradient-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 528 528" width="60" height="60">
      <defs>
        <linearGradient id="gradient">
          <stop offset="0%"  stop-color="white" />
          <stop offset="100%" stop-color="black" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="75" fill="url(#gradient)" stroke="#000000" stroke-width="16"/>
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
      operation: 'gradient',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii04IC04IDUyOCA1MjgiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSI3NSIgZmlsbD0idXJsKCNhKSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjE2Ii8+PC9zdmc+") 1 1, default'
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
    width () {
      return this.context.canvas.width
    },
    height () {
      return this.context.canvas.height
    }
  },
  methods: {
    ...mapActions({
      setCurrentTool: 'drawer/setCurrentTool',
      setCurrentDataURL: 'drawer/setCurrentDataURL'
    }),
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
      const { x: x1, y: y1 } = this.getCoordinates(event)

      this.context.save()

      const mousemove = (e) => {
        if (!e.target.contains(this.showContext.canvas)) return

        const { x: x2, y: y2 } = this.getCoordinates(e)

        const gradient = this.context.createLinearGradient(x1, y1, x2, y2)

        gradient.addColorStop(0, this.mainColor)
        gradient.addColorStop(1, this.secondaryColor)

        this.context.fillStyle = gradient
        this.context.fillRect(0, 0, this.width, this.height)

        this.setCurrentDataURL(this.context.canvas.toDataURL())
      }

      mousemove(event)

      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)

        this.context.restore()

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
