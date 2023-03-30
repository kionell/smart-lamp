<template>
  <div
    class="context-tools context-versioning buttons"
    :translation="$t('undo')"
  >
    <svg
      ref="undo"
      class="mirrored"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 528 528"
      width="30"
      height="30"
      @click="undoState"
    >
      <g stroke="#000000" stroke-width="16" fill="#FFFFFF">
        <path d="M336 80l160 160-160 160v-96h-98c-88 0-170 46-217 120l-5 8c0-141 115-256 256-256h64V80z"/>
      </g>
    </svg>
  </div>

  <div
    class="context-tools context-versioning buttons"
    :translation="$t('redo')"
  >
    <svg
      ref="redo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 528 528"
      width="30"
      height="30"
      @click="redoState"
    >
      <g stroke="#000000" stroke-width="16" fill="#FFFFFF">
        <path d="M336 80l160 160-160 160v-96h-98c-88 0-170 46-217 120l-5 8c0-141 115-256 256-256h64V80z"/>
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
      context: 'drawer/getCurrentContext',
      stateID: 'drawer/getCurrentState',
      dataURL: 'drawer/getCurrentDataURL'
    })
  },
  methods: {
    ...mapActions({
      setCurrentState: 'drawer/setCurrentState'
    }),
    undoState () {
      this.setCurrentState(+this.stateID - 1)
    },
    redoState () {
      this.setCurrentState(+this.stateID + 1)
    }
  },
  watch: {
    stateID () {
      if (!this.dataURL) return

      const img = new Image()

      img.onload = () => {
        const w = this.context.canvas.width
        const h = this.context.canvas.height

        this.context.clearRect(0, 0, w, h)
        this.context.drawImage(img, 0, 0)
      }

      img.src = this.dataURL
    }
  }
})
</script>
