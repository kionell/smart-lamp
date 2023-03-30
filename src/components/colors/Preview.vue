<template>
  <canvas
    class="selected-color-preview"
    ref="selected"
  />
  <canvas
    class="current-color-preview"
    ref="current"
  />
</template>
<script>
import { defineComponent } from 'vue'
import { createAlphaSquare } from './composible'

export default defineComponent({
  props: {
    selected: {
      type: String,
      default: '#000000'
    },
    current: {
      type: String,
      default: '#000000'
    },
    width: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 30
    }
  },
  data () {
    return {
      alphaSize: 5,
      selectedContext: null,
      currentContext: null
    }
  },
  watch: {
    selected () {
      this.showSelected()
    },
    current () {
      this.renderColor()
    }
  },
  mounted () {
    this.setPreviewSize()
    this.showSelected()
    this.renderColor()
  },
  methods: {
    setPreviewSize () {
      const currentCanvas = this.$refs.current
      const selectedCanvas = this.$refs.selected

      selectedCanvas.width = currentCanvas.width = this.width
      selectedCanvas.height = currentCanvas.height = this.height

      this.currentContext = currentCanvas.getContext('2d')
      this.selectedContext = selectedCanvas.getContext('2d')
    },

    showSelected () {
      const width = this.width
      const height = this.height
      const ctx = this.selectedContext

      const canvasSquare = createAlphaSquare(this.alphaSize)

      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = this.selected
      ctx.fillRect(0, 0, width, height)
    },

    renderColor () {
      const width = this.width
      const height = this.height
      const ctx = this.currentContext

      const canvasSquare = createAlphaSquare(this.alphaSize)

      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = this.current
      ctx.fillRect(0, 0, width, height)
    }
  }
})
</script>
