<template>
  <div class="viewport-zoom">
    <div
      class="viewport-zoom__button_in buttons"
      :translation="$t('zoomIn')"
    >
      <svg
        @click="setFixedScale(scale + 0.5)"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-8 -8 528 528"
        width="30"
        height="30"
      >
        <g stroke="#000000" stroke-width="16" fill="#FFFFFF">
          <path d="M386.348,336.165c23.574-34.148,37.408-75.546,37.408-120.19c0-117.015-94.843-211.878-211.878-211.878 S0,98.959,0,215.974s94.843,211.878,211.878,211.878c48.849,0,93.8-16.572,129.637-44.338l124.388,124.388L512,461.812 L386.348,336.165z M211.878,382.217c-91.667,0-166.243-74.574-166.243-166.243c0-91.667,74.574-166.243,166.243-166.243 s166.243,74.574,166.243,166.243S303.545,382.217,211.878,382.217z"></path>
          <polygon points="234.695,196.417 234.695,114.924 189.06,114.924 189.06,196.417 107.569,196.417 107.569,242.052 189.06,242.052 189.06,323.543 234.695,323.543 234.695,242.052 316.187,242.052 316.187,196.417"></polygon>
        </g>
      </svg>
    </div>

    <input
      type="text"
      ref="zoomInput"
      class="viewport-zoom__input"
      placeholder="100%"
      @change="setCustomScale"
    >

    <div
      class="viewport-zoom__button_out buttons"
      :translation="$t('zoomOut')"
    >
      <svg
        @click="setFixedScale(scale - 0.5)"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-8 -8 528 528"
        width="30"
        height="30"
      >
        <g stroke="#000000" stroke-width="16" fill="#FFFFFF">
          <path d="M386.348,336.165c23.574-34.148,37.408-75.546,37.408-120.19c0-117.015-94.843-211.878-211.878-211.878 S0,98.959,0,215.974s94.843,211.878,211.878,211.878c48.849,0,93.8-16.572,129.637-44.338l124.388,124.388L512,461.812 L386.348,336.165z M211.878,382.217c-91.667,0-166.243-74.574-166.243-166.243c0-91.667,74.574-166.243,166.243-166.243 s166.243,74.574,166.243,166.243S303.545,382.217,211.878,382.217z"></path>
          <rect x="107.572" y="196.419" width="208.613" height="45.635"></rect>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters({
      scale: 'drawer/getScale'
    })
  },
  methods: {
    ...mapActions({
      setScale: 'drawer/setScale'
    }),
    setFixedScale (scale) {
      this.setScale(scale)

      this.showScale()
    },
    setCustomScale (event) {
      const rawValue = event.target?.value

      let scalePercentage = 100

      if (typeof rawValue === 'string') {
        scalePercentage = Number(rawValue.match(/[0-9]+/gm)?.[0]) ?? 100
      }

      this.setScale(scalePercentage / 100)

      this.showScale()
    },
    showScale () {
      const zoomInput = this.$refs.zoomInput

      zoomInput.value = Math.round(this.scale * 100) + '%'
    }
  }
})
</script>

<style lang="scss" scoped>
.viewport-zoom {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.viewport-zoom__button_in,
.viewport-zoom__button_out {
  cursor: pointer;
}

.viewport-zoom__button_out:after {
  left: -200%;
}

.viewport-zoom__input {
  width: 80px;
  height: 30px;
  color: $text-color;
  text-align: center;
  font-size: 16px;
}
</style>
