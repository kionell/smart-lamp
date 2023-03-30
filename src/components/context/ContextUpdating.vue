<template>
  <div
    class="context-updating"
    @click="sendDrawing"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="25 -8 304 337" width="30" height="30">
      <path d="M295.84,146.049l-256-144c-4.96-2.784-11.008-2.72-15.904,0.128C19.008,5.057,16,10.305,16,16.001v288
        c0,5.696,3.008,10.944,7.936,13.824c2.496,1.44,5.28,2.176,8.064,2.176c2.688,0,5.408-0.672,7.84-2.048l256-144
        c5.024-2.848,8.16-8.16,8.16-13.952S300.864,148.897,295.84,146.049z" fill="#FFFFFF" stroke="#000000" stroke-width="16"/>
    </svg>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters({
      context: 'drawer/getCurrentContext'
    })
  },
  methods: {
    sendDrawing () {
      const width = this.context.canvas.width
      const height = this.context.canvas.height

      const imageData = this.context.getImageData(0, 0, width, height)

      const colors = Array
        .from(imageData.data)
        .filter((_, i) => (i + 1) % 4 !== 0)

      const xhr = new XMLHttpRequest()

      xhr.open('POST', '/draw', true)

      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.send(JSON.stringify(colors))
    }
  }
})
</script>
