<template>
  <div
    class="hu-color-picker"
    :class="{ light: isLightTheme }"
    :style="{ width: totalWidth + 'px' }"
  >
    <div class="color-set">
      <Saturation
        ref="saturation"
        :color="saturationColor"
        :hsv="hsv"
        :size="hueHeight"
        @selectSaturation="selectSaturation"
      />
      <Hue
        ref="hue"
        :hsv="hsv"
        :width="hueWidth"
        :height="hueHeight"
        @selectHue="selectHue"
      />
    </div>
    <div :style="{ height: previewHeight + 'px' }" class="color-show">
      <Preview
        :selected="selectedColor"
        :current="rgbString"
        :width="previewWidth"
        :height="previewHeight"
      />
    </div>
    <ColorBox
      name="HEX"
      :color="modelHex"
      :validator="validateHEXString"
      @colorChange="changeHex"
    />
    <ColorBox
      name="RGB"
      :color="modelRgb"
      :validator="validateRGBString"
      @colorChange="changeRgb"
    />
    <Colors
      ref="colors"
      :color="rgbString"
      :colors-default="colorsDefault"
      @colorSelect="setPaletteColor"
    />
    <ColorButton
      :style="{ width: totalWidth + 'px', height: previewHeight + 'px' }"
      @click="selectColor"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { setColorValue, rgb2hex, rgb2hsv, hsv2rgb } from './composible.js'

import Saturation from './Saturation.vue'
import Hue from './Hue.vue'
import Preview from './Preview.vue'
import ColorBox from './ColorBox.vue'
import Colors from './Colors.vue'
import ColorButton from './ColorButton.vue'

export default defineComponent({
  components: {
    Saturation,
    Hue,
    Preview,
    ColorBox,
    Colors,
    ColorButton
  },
  emits: ['colorSelect', 'colorChange'],
  props: {
    color: {
      type: String,
      default: '#000000'
    },
    theme: {
      type: String,
      default: 'dark'
    },
    colorsDefault: {
      type: Array,
      default: () => [
        '#FF1900',
        '#F47365',
        '#FFB243',
        '#FFE623',
        '#6EFF2A',
        '#1BC7B1',
        '#00BEFF',
        '#2E81FF',
        '#5D61FF',
        '#FF89CF',
        '#FC3CAD',
        '#BF3DCE',
        '#8E00A7',
        '#7200FF'
      ]
    }
  },
  data () {
    return {
      hueWidth: 15,
      hueHeight: 159,
      previewHeight: 30,
      selectedColor: '#000000',
      saturationColor: '#000000',
      modelRgb: '',
      modelHex: '',
      r: 0,
      g: 0,
      b: 0,
      h: 0,
      s: 0,
      v: 0
    }
  },
  computed: {
    isLightTheme () {
      return this.theme === 'light'
    },
    totalWidth () {
      return this.hueHeight + this.hueWidth + 8
    },
    previewWidth () {
      return this.totalWidth / 2
    },
    rgb () {
      return {
        r: this.r,
        g: this.g,
        b: this.b
      }
    },
    hsv () {
      return {
        h: this.h,
        s: this.s,
        v: this.v
      }
    },
    rgbString () {
      return `rgb(${this.r}, ${this.g}, ${this.b})`
    },
    rgbStringShort () {
      return `${this.r}, ${this.g}, ${this.b}`
    },
    hexString () {
      return rgb2hex(this.rgb, true)
    }
  },
  created () {
    Object.assign(this, setColorValue(this.color))
    this.selectedColor = this.color
    this.setText()

    this.$watch('rgb', () => {
      this.$emit('colorChange', {
        rgb: this.rgb,
        hsv: this.hsv,
        hex: this.modelHex
      })
    })
  },
  methods: {
    validateRGBString (color) {
      const regexRGB = /([0-9]{0,3}(,( ){0,1}){0,1}){0,1}/gim

      color = color.match(regexRGB)?.join('') || ''

      let [r, g, b] = color.split(',').filter(c => c).map(c => c.trim())

      r = Math.max(0, Math.min(r, 255))
      g = Math.max(0, Math.min(g, 255))
      b = Math.max(0, Math.min(b, 255))

      return [r, g, b].map(c => c || 0).join(', ')
    },
    validateHEXString (color) {
      const regexHEX = /([0-9A-Fa-f])/gim

      color = color.match(regexHEX)?.join('') || ''

      if (color.length === 3) {
        color = color.split('').map(c => c + c).join('')
      }

      const matches = color.match(/.{1,2}/g) || []

      const hex = matches.splice(0, 3).join('').padEnd(6, '0')

      return '#' + hex.toUpperCase()
    },
    selectSaturation (color) {
      const { s, v } = rgb2hsv(color)
      const { r, g, b } = hsv2rgb({ h: this.h, s, v })
      Object.assign(this, { r, g, b, s, v })
      this.setText()
    },
    selectHue (color) {
      const { h } = rgb2hsv(color)
      const { r, g, b } = hsv2rgb({ h, s: this.s, v: this.v })
      const saturationColor = rgb2hex(hsv2rgb({ h, s: 1, v: 1 }))
      Object.assign(this, { r, g, b, h, saturationColor })
      this.setText()
      this.$nextTick(() => {
        this.$refs.saturation.renderColor()
        this.$refs.saturation.renderSlide()
      })
    },
    changeHex (color) {
      const { r, g, b, h, s, v } = setColorValue(color)
      const saturationColor = rgb2hex(hsv2rgb({ h, s: 1, v: 1 }))
      Object.assign(this, { r, g, b, h, s, v, saturationColor })
      this.modelHex = color
      this.modelRgb = this.rgbStringShort
      this.$nextTick(() => {
        this.$refs.saturation.renderColor()
        this.$refs.saturation.renderSlide()
        this.$refs.hue.renderSlide()
      })
    },
    changeRgb (color) {
      const { r, g, b, h, s, v } = setColorValue(color)
      const saturationColor = rgb2hex(hsv2rgb({ h, s: 1, v: 1 }))
      Object.assign(this, { r, g, b, h, s, v, saturationColor })
      this.modelHex = this.hexString
      this.modelRgb = color
      this.$nextTick(() => {
        this.$refs.saturation.renderColor()
        this.$refs.saturation.renderSlide()
        this.$refs.hue.renderSlide()
      })
    },
    setText () {
      this.modelHex = this.hexString
      this.modelRgb = this.rgbStringShort
    },
    setPaletteColor (color) {
      const { r, g, b, h, s, v } = setColorValue(color)
      const saturationColor = rgb2hex(hsv2rgb({ h, s: 1, v: 1 }))
      Object.assign(this, { r, g, b, h, s, v, saturationColor })
      this.setText()
      this.$nextTick(() => {
        this.$refs.saturation.renderColor()
        this.$refs.saturation.renderSlide()
        this.$refs.hue.renderSlide()
      })
    },
    selectColor () {
      this.selectedColor = this.hexString
      this.$refs.colors.addColorToHistory(this.selectedColor)
      this.$emit('colorSelect', this.selectedColor)
    }
  }
})
</script>

<style lang="scss">
.hu-color-picker {
  padding: 10px;
  background: $main-color;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.3);
  z-index: 1;
  cursor: default;

  &.light {
    background: #f7f8f9;
    .color-type {
      .name {
        background: #e7e8e9;
      }
      .value {
        color: #666;
        background: #eceef0;
      }
    }
    .colors.history {
      border-top: 1px solid #eee;
    }
  }

  canvas {
    vertical-align: top;
  }

  .color-set {
    display: flex;
  }

  .color-show {
    margin-top: 8px;
    display: flex;
  }

  .color-type {
    margin-top: 8px;
  }

  .color-select {
    margin-top: 8px;
  }
}
</style>
