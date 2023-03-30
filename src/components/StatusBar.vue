<template>
  <div class="status-bar">
    <div class="status-bar__viewport">
      <Viewport />
      <Zooming />
    </div>

    <perfect-scrollbar
      ref="historyScroll"
      class="status-bar__history_scroll"
    >
      <History />
    </perfect-scrollbar>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import Viewport from './canvas/Viewport'
import Zooming from './canvas/Zooming'
import History from './canvas/History'

export default defineComponent({
  components: {
    Viewport,
    Zooming,
    History
  }
})
</script>

<style lang="scss" scoped>
  .status-bar {
    min-width: 300px;
    width: 300px;
    background-color: $main-color;
    display: flex;
    flex-direction: column;
  }

  .status-bar__viewport {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .status-bar__history_scroll {
    position: relative;
    width: 100%;
    height: 0px;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    background-color: darken($main-color, 5%);
    box-shadow: inset 0px 4px 5px rgba(0, 0, 0, 0.3);
  }
</style>
