<template>
  <div class="color-panel">
    <div class="color_panel__previews">
      <div
        ref="secondaryPreview"
        class="color-panel__secondary-color color-previews buttons"
        :translation="$t('secondaryColor')"
        :style="{ backgroundColor: secondaryColor }"
        @click="toggleSecondaryPicker"
      >
        <div class="color-panel__secondary-picker">
          <ColorPicker
            ref="secondaryPicker"
            theme="dark"
            :color="secondaryColor"
            v-show="showSecondaryPicker"
            @click="$event.stopPropagation()"
            @colorSelect="changeSecondaryColor"
          />
        </div>
      </div>
      <div
        ref="mainPreview"
        class="color-panel__main-color color-previews buttons"
        :translation="$t('mainColor')"
        :style="{ backgroundColor: mainColor }"
        @click="toggleMainPicker"
      >
        <div class="color-panel__main-picker">
          <ColorPicker
            ref="mainPicker"
            theme="dark"
            :color="mainColor"
            v-show="showMainPicker"
            @click="$event.stopPropagation()"
            @colorSelect="changeMainColor"
          />
        </div>
      </div>
    </div>

    <div
      class="color-panel__default-colors buttons"
      :translation="$t('defaultColors')"
      @click="resetColors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <rect width="14" height="14" x="6" y="6" fill="#FFFFFF" stroke="#000000" stroke-width="1"></rect>
        <rect width="14" height="14" fill="#000000" stroke="#FFFFFF" stroke-width="1"></rect>
      </svg>
    </div>

    <div
      class="color-panel__swap-arrow buttons"
      :translation="$t('swapColors')"
      @click="swapColors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11" width="20" height="20" style="transform: scale(-1, -1)">
        <path d="M3.01 2A6 6 0 019 8h1.83l-2.91 2.91L5 8h2a4 4 0 00-3.99-4v1.93L.1 3.02 3.01.1V2z" fill="#FFFFFF"/>
      </svg>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import ColorPicker from './ColorPicker'

export default defineComponent({
  components: {
    ColorPicker
  },
  data () {
    return {
      showMainPicker: false,
      showSecondaryPicker: false
    }
  },
  computed: {
    ...mapGetters({
      mainColor: 'colors/getMainColor',
      secondaryColor: 'colors/getSecondaryColor'
    })
  },
  methods: {
    ...mapActions({
      loadColorPicker: 'colors/loadColorPicker',
      setMainColor: 'colors/setMainColor',
      setSecondaryColor: 'colors/setSecondaryColor'
    }),
    toggleMainPicker (event) {
      this.showSecondaryPicker = false
      this.showMainPicker = !this.showMainPicker

      event.stopPropagation()

      if (this.showMainPicker) return

      let target

      const getTarget = (e) => {
        target = e.target
      }

      const hide = (e) => {
        if (target === this.$refs.mainPicker.$el) return

        this.showMainPicker = false
        document.removeEventListener('mousedown', hide)
        document.removeEventListener('mouseup', hide)
      }

      document.addEventListener('mousedown', getTarget)
      document.addEventListener('mouseup', hide)
    },
    toggleSecondaryPicker (event) {
      this.showMainPicker = false
      this.showSecondaryPicker = !this.showSecondaryPicker

      event.stopPropagation()

      if (this.showSecondaryPicker) return

      let target

      const getTarget = (e) => {
        target = e.target
      }

      const hide = (e) => {
        if (target === this.$refs.secondaryPicker.$el) return

        this.showSecondaryPicker = false
        document.removeEventListener('mousedown', hide)
        document.removeEventListener('mouseup', hide)
      }

      document.addEventListener('mousedown', getTarget)
      document.addEventListener('mouseup', hide)
    },
    changeMainColor (color) {
      this.setMainColor(color)
      this.showMainPicker = false
    },
    changeSecondaryColor (color) {
      this.setSecondaryColor(color)
      this.showSecondaryPicker = false
    },
    resetColors () {
      this.setMainColor('#000000')
      this.setSecondaryColor('#FFFFFF')
    },
    swapColors () {
      const main = this.secondaryColor
      const secondary = this.mainColor

      this.setMainColor(main)
      this.setSecondaryColor(secondary)
    }
  },
  watch: {
    mainColor (newColor) {
      this.$refs.mainPicker.changeHex(newColor)
      this.$refs.mainPicker.selectColor()
    },
    secondaryColor (newColor) {
      this.$refs.secondaryPicker.changeHex(newColor)
      this.$refs.secondaryPicker.selectColor()
    }
  },
  mounted () {
    this.loadColorPicker()
  }
})
</script>

<style lang="scss" scoped>
  .color-panel {
    width: 120px;
    height: 100px;
    position: relative;
  }

  .color_panel__previews {
    width: 100%;
    height: 100%;
  }

  .color-panel__secondary-color {
    bottom: 0;
    right: 0;
  }

  .color-panel__default-colors {
    position: absolute;
    right: 15px;
    top: 5px;
    cursor: pointer;
  }

  .color-panel__swap-arrow {
    position: absolute;
    left: 15px;
    bottom: 5px;
    cursor: pointer;
  }

  .color-panel__main-picker {
    position: absolute;
    bottom: 0px;
    left: 145px;
  }

  .color-panel__secondary-picker {
    position: absolute;
    bottom: 0px;
    left: 95px;
  }

  .color-previews {
    position: absolute;
    width: 70px;
    height: 70px;
    box-sizing: border-box;
    border-style: solid;
    border-width: 1px;
    border-color: #FFFFFF;
    cursor: pointer;
  }
</style>
