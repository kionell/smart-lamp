<template>
  <div
    class="history-state"
    @click="setCurrentState(id)"
  >
    <div class="history-state__name">
      <span>{{$t(name)}}</span>
    </div>

    <div
      ref="deleteButton"
      class="history-state__button_delete buttons"
      :style="{ display: id > 0 ? 'block' : 'none'}"
      :translation="$t('delete')"
      @click="$event.stopPropagation(); removeFromHistory(id)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 528 528" width="25" height="25">
        <g stroke="#000000" stroke-width="16" fill="#D00000">
          <path d="M415 495L256 336 97 495a57 57 0 01-80-80l159-159L17 97a57 57 0 0180-80l159 159L415 17a57 57 0 0180 80L336 256l159 159a57 57 0 01-80 80zm0 0"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default defineComponent({
  props: {
    name: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: -1
    }
  },
  computed: {
    ...mapGetters({
      stateHistory: 'drawer/getStateHistory'
    })
  },
  methods: {
    ...mapActions({
      setCurrentState: 'drawer/setCurrentState',
      removeFromHistory: 'drawer/removeFromHistory'
    })
  }
})
</script>

<style lang="scss" scoped>
  .history-state {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 8px;
    padding-bottom: 8px;
    min-height: 25px;
    cursor: pointer;
    border-bottom: 1px solid black;
  }

  .history-state:hover {
    background-color: $highlight-color;
  }

  .history-state__name {
    color: inherit;
    user-select: none;
  }

  .history-state__button_delete:after {
    top: -6px;
    left: -250%;
  }
</style>
