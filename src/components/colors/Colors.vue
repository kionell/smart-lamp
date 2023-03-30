<template>
  <div class="color-palette">
    <ul class="colors">
      <li
        v-for="item in colorsDefault"
        :key="item"
        class="item"
        @click="selectPaletteColor(item)"
      >
        <div :style="{ background: item }" class="color" />
      </li>
    </ul>
    <ul v-if="colorsHistory.length" class="colors history">
      <li
        v-for="item in colorsHistory"
        :key="item"
        class="item"
        @click="selectPaletteColor(item)"
      >
        <div :style="{ background: item }" class="color" />
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { createAlphaSquare } from './composible'

export default defineComponent({
  name: 'ColorPicker',
  props: {
    color: {
      type: String,
      default: '#000000'
    },
    colorsDefault: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      colorsHistory: 'colors/getColorsHistory'
    })
  },
  methods: {
    ...mapActions({
      setColorsHistory: 'colors/setColorsHistory'
    }),
    // Add new color to the history and update the local storage
    addColorToHistory (color) {
      // If color isn't found
      if (!color) return

      // Get array of colors and try to find existing color
      const history = [...this.colorsHistory]
      const index = history.indexOf(color)

      // If color is already exists in the history
      if (index >= 0) {
        // Remove it from the array
        history.splice(index, 1)
      }

      // Limit colors history up to 6 elements
      if (history.length >= 7) {
        history.length = 6
      }

      // Add new color to the beginning of the array
      history.unshift(color)

      this.setColorsHistory(history)
    },
    selectPaletteColor (color) {
      this.$emit('colorSelect', color)
    }
  },
  setup (_) {
    const imgAlphaBase64 = ref()

    imgAlphaBase64.value = createAlphaSquare(4).toDataURL()

    return {
      imgAlphaBase64
    }
  }
})
</script>
<style lang="scss">
.colors {
  padding: 0;
  margin: 8px 0 0 0;

  &.history {
    border-top: 1px solid $highlight-color;
  }
  .item {
    position: relative;
    width: 16px;
    height: 16px;
    margin: 5px;
    border-radius: 3px;
    box-sizing: border-box;
    vertical-align: top;
    display: inline-block;
    transition: all 0.1s;
    cursor: pointer;
    &:hover {
      transform: scale(1.4);
    }
    .color {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }
}
</style>
