<template>
  <div
    class="context-tools context-mirroring buttons"
    :translation="$t('horizontalMirror')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 528 528"
      width="30"
      height="30"
      @click="drawMirrored(true)"
    >
      <g stroke="#000000" stroke-width="16" fill="#FFFFFF">
        <path d="M256,0c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15V15C271,6.716,264.284,0,256,0z"></path>
        <path d="M256,137c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,143.716,264.284,137,256,137z"></path>
        <path d="M256,275c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,281.716,264.284,275,256,275z"></path>
        <path d="M256,412c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,418.716,264.284,412,256,412z"></path>
        <path d="M179.402,103.503l-120-36.842c-4.549-1.398-9.49-0.553-13.317,2.276C42.258,71.765,40,76.241,40,81v350 c0,4.759,2.258,9.235,6.085,12.063c3.841,2.839,8.787,3.668,13.317,2.275l120-36.842c6.299-1.933,10.598-7.751,10.598-14.339 V117.842C190,111.254,185.7,105.437,179.402,103.503z"></path>
        <path d="M465.915,68.937c-3.826-2.828-8.77-3.673-13.317-2.276l-120,36.842c-6.299,1.933-10.598,7.751-10.598,14.339v276.316 c0,6.588,4.3,12.405,10.598,14.339l120,36.842c4.566,1.402,9.505,0.541,13.317-2.276C469.742,440.235,472,435.759,472,431V81 C472,76.241,469.742,71.765,465.915,68.937z"></path>
      </g>
    </svg>
  </div>

  <div
    class="context-tools context-mirroring buttons"
    :translation="$t('verticalMirror')"
  >
    <svg
      class="rotated"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 528 528"
      width="30"
      height="30"
      @click="drawMirrored(false)"
    >
      <g stroke="#000000" stroke-width="16" fill="#FFFFFF">
        <path d="M256,0c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15V15C271,6.716,264.284,0,256,0z"></path>
        <path d="M256,137c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,143.716,264.284,137,256,137z"></path>
        <path d="M256,275c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,281.716,264.284,275,256,275z"></path>
        <path d="M256,412c-8.284,0-15,6.716-15,15v70c0,8.284,6.716,15,15,15s15-6.716,15-15v-70C271,418.716,264.284,412,256,412z"></path>
        <path d="M179.402,103.503l-120-36.842c-4.549-1.398-9.49-0.553-13.317,2.276C42.258,71.765,40,76.241,40,81v350 c0,4.759,2.258,9.235,6.085,12.063c3.841,2.839,8.787,3.668,13.317,2.275l120-36.842c6.299-1.933,10.598-7.751,10.598-14.339 V117.842C190,111.254,185.7,105.437,179.402,103.503z"></path>
        <path d="M465.915,68.937c-3.826-2.828-8.77-3.673-13.317-2.276l-120,36.842c-6.299,1.933-10.598,7.751-10.598,14.339v276.316 c0,6.588,4.3,12.405,10.598,14.339l120,36.842c4.566,1.402,9.505,0.541,13.317-2.276C469.742,440.235,472,435.759,472,431V81 C472,76.241,469.742,71.765,465.915,68.937z"></path>
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
    drawMirrored (horizontal = true) {
      if (!this.context) return

      const img = new Image()
      const scaleX = horizontal ? -1 : 1
      const scaleY = -scaleX

      img.onload = () => {
        const canvas = this.context.canvas
        const width = canvas.width / 2
        const height = canvas.height / 2

        this.context.save()
        this.context.clearRect(0, 0, width * 2, height * 2)
        this.context.translate(width, height)
        this.context.scale(scaleX, scaleY)
        this.context.drawImage(img, -width, -height)

        const version = {
          operation: horizontal ? 'horizontalMirror' : 'verticalMirror',
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
