<template>
  <div class="effect-box boxes">
    <div class="effect-box__name box-names">
      {{$t('effectSettings')}}
    </div>

    <div class="effect-box__storage box-storages">
      <EffectsForm />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

import EffectsForm from '../forms/EffectsForm.vue'

export default defineComponent({
  components: {
    EffectsForm
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

  }
})
</script>
