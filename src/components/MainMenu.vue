<template>
  <div id="main-menu">
    <div class="main-menu__context-state">
      <ContextSaving
        class="context-tools buttons"
        :translation="$t('save')"
      />
      <ContextUploading
        class="context-tools buttons"
        :translation="$t('upload')"
      />
      <ContextVersioning />
      <ContextUpdating
        class="context-tools buttons"
        :translation="$t('update')"
      />
    </div>

    <div class="main-menu__context-edit">
      <ContextRotation />
      <ContextMirroring />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import ContextSaving from './context/ContextSaving'
import ContextUploading from './context/ContextUploading'
import ContextVersioning from './context/ContextVersioning'
import ContextUpdating from './context/ContextUpdating'
import ContextRotation from './context/ContextRotation'
import ContextMirroring from './context/ContextMirroring'

export default defineComponent({
  components: {
    ContextSaving,
    ContextUploading,
    ContextVersioning,
    ContextUpdating,
    ContextRotation,
    ContextMirroring
  }
})
</script>

<style lang="scss">
  #main-menu {
    height: 50px;
    background-color: $main-color;
    display: flex;
    align-items: center;
  }

  .main-menu__context-state {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 20px;
    border-right: 2px solid #FFFFFF;
  }

  .main-menu__context-edit {
    display: flex;
  }

  .context-tools {
    margin-left: 20px;
    cursor: pointer;
  }

  .vr {
    margin-left: 20px;
  }
</style>
