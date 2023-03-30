<template>
  <div class="matrix-page">
    <div class="menu-container">
      <MainMenu />
    </div>
    <div class="drawing-container">
      <Toolbar ref="toolbar" />
      <Workspace @startDrawing="executeTool"/>
      <StatusBar />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import MainMenu from '@/components/MainMenu'
import Toolbar from '@/components/Toolbar'
import Workspace from '@/components/Workspace'
import StatusBar from '@/components/StatusBar'

export default {
  name: 'MatrixPage',
  components: {
    MainMenu,
    Toolbar,
    Workspace,
    StatusBar
  },
  methods: {
    ...mapActions({
      loadDrawer: 'drawer/loadDrawer'
    }),
    executeTool (event) {
      this.$refs.toolbar.executeTool(event)
    }
  },
  beforeMount () {
    this.loadDrawer()
  }
}
</script>

<style lang="scss">
  @import url('@/assets/scss/scrollbar.scss');

  .matrix-page {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .drawing-container {
    flex-grow: 1;
    flex-basis: auto;
    display: flex;
    position: relative;
    z-index: 1;
  }

  .menu-container {
    flex-basis: 50px;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 2;
  }

  .canvases {
    image-rendering: optimizeSpeed;             // Older versions of FF
    image-rendering: -moz-crisp-edges;          // FF 6.0+
    image-rendering: -webkit-optimize-contrast; // Safari
    image-rendering: -o-crisp-edges;            // OS X & Windows Opera (12.02+)
    image-rendering: pixelated;                 // Awesome future-browsers
    -ms-interpolation-mode: nearest-neighbor;   // IE
    background-color: transparent;

    display: block;
    position: relative;

    width: 100%;
    height: 100%;
  }
</style>
