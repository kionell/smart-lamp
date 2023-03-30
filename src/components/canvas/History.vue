<template>
  <HistoryState
    v-for="(state, i) in stateHistory"
    :key="i"
    :id="i"
    :name="state.operation"
    :class="highlightHistory(i)"
  />
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import HistoryState from './HistoryState'

export default defineComponent({
  components: {
    HistoryState
  },
  computed: {
    ...mapGetters({
      stateHistory: 'drawer/getStateHistory',
      stateID: 'drawer/getCurrentState'
    })
  },
  methods: {
    highlightHistory (id) {
      const stateID = Number(this.stateID)

      const classList = [
        id <= stateID ? 'text' : 'inactive'
      ]

      if (id === stateID) {
        classList.push('selected')
      }

      return classList
    }
  }
})
</script>
