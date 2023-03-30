<template>
  <div class="context-uploading">
    <input
      id="context-uploading__button"
      type="file"
      accept="image/png"
      @change="drawUploaded"
      hidden
    >
    <label for="context-uploading__button" class="context-uploading__icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 15 491 445" width="30" height="30">
        <path d="M454.571,138.49c2.452,0,4.847,0.418,7.249,0.749v-35.784c0-12.205-9.888-22.096-22.087-22.096H222.557
          c-18.598,0-33.681-15.082-33.681-33.679v-2.522c0-12.206-9.888-22.096-22.095-22.096H36.931c-12.2,0-22.087,9.89-22.087,22.096
          v94.081c2.402-0.331,4.798-0.749,7.249-0.749H454.571z" fill="#FFFFFF" stroke="#000000" stroke-width="16"/>
        <path d="M470.631,177.686c-4.175-4.413-9.983-6.919-16.06-6.919H22.093c-6.076,0-11.884,2.506-16.059,6.919
          c-4.177,4.42-6.345,10.362-5.998,16.431l13.616,238.65c0.67,11.694,10.347,20.835,22.057,20.835h405.246
          c11.71,0,21.387-9.141,22.057-20.835l13.616-238.65C476.975,188.048,474.808,182.106,470.631,177.686z" fill="#FFFFFF" stroke="#000000" stroke-width="16"/>
      </svg>
    </label>
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
    drawUploaded (event) {
      const file = event?.target?.files[0] ?? null

      if (!this.context || !file) return

      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()

        img.onload = () => {
          this.context.drawImage(img, 0, 0)

          const version = {
            operation: 'upload',
            dataURL: this.context.canvas.toDataURL()
          }

          this.setCurrentDataURL(version.dataURL)
          this.addToHistory(version)

          event.target.value = ''
        }

        img.src = e.target.result
      }

      reader.readAsDataURL(file)
    }
  }
})
</script>

<style lang="scss" scoped>
.context-uploading__icon {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}
</style>
