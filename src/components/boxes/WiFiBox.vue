<template>
  <div class="wifi-box boxes">
    <div class="wifi-box__name box-names">
      {{$t('wifiSettings')}}
    </div>

    <div class="wifi-box__storage box-storages">
      <WiFiLocalForm />
      <hr>
      <WiFiStationForm />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

import WiFiLocalForm from '../forms/WiFiLocalForm.vue'
import WiFiStationForm from '../forms/WiFiStationForm.vue'

export default defineComponent({
  components: {
    WiFiLocalForm,
    WiFiStationForm
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
