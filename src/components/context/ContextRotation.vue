<template>
  <div
    class="context-tools context-rotation buttons"
    :translation="$t('rotateLeft')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 528 528"
      width="30"
      height="30"
      @click="drawRotated(false)"
    >
      <g stroke="#000000" stroke-width="16" fill="#FFFFFF">
        <path d="M139.453,120.747L1.107,259.093L139.453,397.44L277.8,259.093L139.453,120.747z M61.373,259.093l77.973-77.973 l78.08,77.973l-77.973,77.973L61.373,259.093z"></path>
        <path d="M395.88,125.44C358.333,88,309.267,69.227,260.093,69.227V0l-90.56,90.56l90.56,90.453v-69.12 c38.187,0,76.48,14.613,105.6,43.733c58.347,58.347,58.347,152.853,0,211.2c-29.12,29.12-67.413,43.733-105.6,43.733 c-20.693,0-41.28-4.373-60.48-12.907l-31.787,31.787c28.587,15.787,60.373,23.787,92.267,23.787 c49.173,0,98.24-18.773,135.787-56.213C470.867,322.027,470.867,200.427,395.88,125.44z"></path>
      </g>
    </svg>
  </div>

  <div
    class="context-tools context-mirroring buttons"
    :translation="$t('rotateRight')"
  >
    <svg
      class="mirrored"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 528 528"
      width="30"
      height="30"
      @click="drawRotated(true)"
    >
      <g stroke="#000000" stroke-width="16" fill="#FFFFFF">
        <path d="M139.453,120.747L1.107,259.093L139.453,397.44L277.8,259.093L139.453,120.747z M61.373,259.093l77.973-77.973 l78.08,77.973l-77.973,77.973L61.373,259.093z"></path>
        <path d="M395.88,125.44C358.333,88,309.267,69.227,260.093,69.227V0l-90.56,90.56l90.56,90.453v-69.12 c38.187,0,76.48,14.613,105.6,43.733c58.347,58.347,58.347,152.853,0,211.2c-29.12,29.12-67.413,43.733-105.6,43.733 c-20.693,0-41.28-4.373-60.48-12.907l-31.787,31.787c28.587,15.787,60.373,23.787,92.267,23.787 c49.173,0,98.24-18.773,135.787-56.213C470.867,322.027,470.867,200.427,395.88,125.44z"></path>
      </g>
    </svg>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters({
      context: 'drawer/getCurrentContext'
    })
  },
  methods: {
    ...mapActions({
      setCurrentDataURL: 'drawer/setCurrentDataURL',
      addToHistory: 'drawer/addToHistory'
    }),
    drawRotated (clockwise = true) {
      if (!this.context) return

      const img = new Image()

      const angle = clockwise ? 90 : -90

      img.onload = () => {
        const canvas = this.context.canvas
        const width = canvas.width / 2
        const height = canvas.height / 2

        this.context.save()
        this.context.clearRect(0, 0, width * 2, height * 2)
        this.context.translate(width, height)
        this.context.rotate(angle * Math.PI / 180)
        this.context.drawImage(img, -width, -height)

        const version = {
          operation: clockwise ? 'rotateRight' : 'rotateLeft',
          dataURL: this.context.canvas.toDataURL()
        }

        this.setCurrentDataURL(version.dataURL)
        this.addToHistory(version)

        this.context.restore()
      }

      img.src = this.context.canvas.toDataURL()
    }
  }
})
</script>
