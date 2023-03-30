<template>
  <div
    class="toolbar"
    @click="setTool"
  >
    <div class="toolbar__drawing-tools">
      <component
        v-for="(tool, i) in tools"
        :ref="tool"
        :is="tool"
        :key="i"
        :id="i"
        :class="i == toolID ? ['selected'] : ['']"
        class="drawing-tools buttons"
        @selectTool="setCursor"
        @endDrawing="addToHistory"
      ></component>
    </div>

    <hr>

    <div class="toolbar__color-panel">
      <ColorPanel />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

import SelectTool from './drawing-tools/SelectTool'
import LineTool from './drawing-tools/LineTool'
import PencilTool from './drawing-tools/PencilTool'
import EllipseTool from './drawing-tools/EllipseTool'
import EraserTool from './drawing-tools/EraserTool'
import RectangleTool from './drawing-tools/RectangleTool'
import PipetteTool from './drawing-tools/PipetteTool'
import BrightnessTool from './drawing-tools/BrightnessTool'
import BucketTool from './drawing-tools/BucketTool'
import GradientTool from './drawing-tools/GradientTool'
import ColorPanel from './colors/ColorPanel'

export default defineComponent({
  components: {
    SelectTool,
    LineTool,
    PencilTool,
    EllipseTool,
    EraserTool,
    RectangleTool,
    PipetteTool,
    BrightnessTool,
    BucketTool,
    GradientTool,
    ColorPanel
  },
  data () {
    return {
      tools: []
    }
  },
  computed: {
    ...mapGetters({
      toolID: 'drawer/getCurrentTool',
      showContext: 'drawer/getShowContext'
    })
  },
  methods: {
    ...mapActions({
      setCurrentCursorURL: 'drawer/setCurrentCursorURL',
      addToHistory: 'drawer/addToHistory',
      setTools: 'drawer/setTools'
    }),
    setCursor (cursorURL) {
      if (cursorURL) {
        this.setCurrentCursorURL(cursorURL)
      }
    },
    executeTool (event) {
      if (this.toolID < 0 || this.toolID >= this.tools.length) return

      if (this.showContext) {
        this.$refs[this.tools[this.toolID]].execute(event)
      }
    }
  },
  mounted () {
    this.tools = [
      'SelectTool',
      'LineTool',
      'PencilTool',
      'EllipseTool',
      'EraserTool',
      'RectangleTool',
      'PipetteTool',
      'BrightnessTool',
      'BucketTool',
      'GradientTool'
    ]

    this.setTools(this.tools)
  }
})
</script>

<style lang="scss" scoped>
  .toolbar {
    min-width: 160px;
    width: 160px;
    background-color: $main-color;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .toolbar__drawing-tools {
    display: flex;
    flex-wrap: wrap;
  }

  .drawing-tools {
    width: 80px;
    height: 80px;
  }

  .drawing-tools:hover {
    background-color: $highlight-color;
  }
</style>
