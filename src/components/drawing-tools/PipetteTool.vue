<template>
  <div
    id="pipette-tool"
    :translation="translation"
    @click="setCurrentTool(id)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469 469" width="60" height="60">
      <path d="M469 79a79 79 0 00-134-56l-74 74-8-9c-4-4-11-4-15 0l-43 43c-4 4-4 11 0 15l14 14L58 311a53 53 0 00-15 37c0 15-5 28-12 40L2 431c-3 5-2 10 1 14l21 21a11 11 0 0014 2l45-31c11-7 23-10 36-10 14 0 28-6 38-17 32-34 125-124 152-150l14 14a11 11 0 0015 0l43-42c4-5 4-11 0-16l-9-8 74-74c15-15 23-34 23-55z" fill="#000000"/>
      <path d="M142 395c-6 7-14 10-23 10-17 0-34 5-48 15l-38 25-9-9 24-36c11-15 16-33 16-52 0-8 3-16 9-22l151-151 70 70c-27 27-120 116-152 150z" fill="#fafafa"/>
      <g fill="#546e7a">
        <path d="M358 224l-28 28-113-113 28-28zM357 193l-81-81 74-74a57 57 0 1181 81l-74 74z"/>
      </g>
      <path d="M224 175l-2 2 51 53c-29 29-126 126-160 164-6 7-15 11-25 11-17 0-35 5-50 16l-14 15 9 9 38-25c14-10 31-15 48-15 9 0 17-3 23-10 32-34 125-123 152-150l-70-70zM358 224l-27 27-21-21 27-28zM419 29a57 57 0 01-9 69l-74 74 21 21 74-74c11-11 17-25 17-40 0-22-12-40-29-50z" opacity=".1"/>
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
      operation: 'pipette',
      cursorURL: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NjkgNDY5IiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxwYXRoIGQ9Ik00NjkgNzlhNzkgNzkgMCAwMC0xMzQtNTZsLTc0IDc0LTgtOWMtNC00LTExLTQtMTUgMGwtNDMgNDNjLTQgNC00IDExIDAgMTVsMTQgMTRMNTggMzExYTUzIDUzIDAgMDAtMTUgMzdjMCAxNS01IDI4LTEyIDQwTDIgNDMxYy0zIDUtMiAxMCAxIDE0bDIxIDIxYTExIDExIDAgMDAxNCAybDQ1LTMxYzExLTcgMjMtMTAgMzYtMTAgMTQgMCAyOC02IDM4LTE3IDMyLTM0IDEyNS0xMjQgMTUyLTE1MGwxNCAxNGExMSAxMSAwIDAwMTUgMGw0My00MmM0LTUgNC0xMSAwLTE2bC05LTggNzQtNzRjMTUtMTUgMjMtMzQgMjMtNTV6Ii8+PHBhdGggZD0iTTE0MiAzOTVjLTYgNy0xNCAxMC0yMyAxMC0xNyAwLTM0IDUtNDggMTVsLTM4IDI1LTktOSAyNC0zNmMxMS0xNSAxNi0zMyAxNi01MiAwLTggMy0xNiA5LTIybDE1MS0xNTEgNzAgNzBjLTI3IDI3LTEyMCAxMTYtMTUyIDE1MHoiIGZpbGw9IiNmYWZhZmEiLz48cGF0aCBkPSJNMzU4IDIyNGwtMjggMjgtMTEzLTExMyAyOC0yOHptLTEtMzFsLTgxLTgxIDc0LTc0YTU3IDU3IDAgMTE4MSA4MWwtNzQgNzR6IiBmaWxsPSIjNTQ2ZTdhIi8+PHBhdGggZD0iTTIyNCAxNzVsLTIgMiA1MSA1M2MtMjkgMjktMTI2IDEyNi0xNjAgMTY0LTYgNy0xNSAxMS0yNSAxMS0xNyAwLTM1IDUtNTAgMTZsLTE0IDE1IDkgOSAzOC0yNWMxNC0xMCAzMS0xNSA0OC0xNSA5IDAgMTctMyAyMy0xMCAzMi0zNCAxMjUtMTIzIDE1Mi0xNTBsLTcwLTcwem0xMzQgNDlsLTI3IDI3LTIxLTIxIDI3LTI4em02MS0xOTVhNTcgNTcgMCAwMS05IDY5bC03NCA3NCAyMSAyMSA3NC03NGMxMS0xMSAxNy0yNSAxNy00MCAwLTIyLTEyLTQwLTI5LTUweiIgb3BhY2l0eT0iLjEiLz48L3N2Zz4=") 0 26, default'
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
      color: 'colors/getMainColor'
    }),
    translation () {
      return this.$t(this.operation)
    },
    sizeDifference () {
      return this.scale * this.pixelSize
    }
  },
  methods: {
    ...mapActions({
      setMainColor: 'colors/setMainColor',
      setSecondaryColor: 'colors/setSecondaryColor',
      setCurrentTool: 'drawer/setCurrentTool'
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
      const mousemove = (e) => {
        if (!e.target.contains(this.showContext.canvas)) return

        const { x, y } = this.getCoordinates(e)

        const imageData = this.context.getImageData(x, y, 1, 1)

        const r = imageData.data[0].toString(16).padStart(2, '0')
        const g = imageData.data[1].toString(16).padStart(2, '0')
        const b = imageData.data[2].toString(16).padStart(2, '0')

        const hex = '#' + r + g + b

        if (this.color === hex) return

        event.which === 3
          ? this.setSecondaryColor(hex)
          : this.setMainColor(hex)
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
