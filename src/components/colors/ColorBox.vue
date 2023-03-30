<template>
  <div class="color-type">
    <span class="name">
      {{ name }}
    </span>
    <input
      ref="colorInput"
      @change="updateValue()"
      :value="modelColor"
      class="value"
    />
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    validator: {
      type: Function,
      default: (_) => true
    }
  },
  methods: {
    updateValue () {
      this.modelColor = this.validator(this.$refs.colorInput.value)
      this.$refs.colorInput.value = this.modelColor
    }
  },
  setup (props, { emit }) {
    const modelColor = computed({
      get () {
        return props.color || ''
      },
      set (value) {
        emit('colorChange', value)
      }
    })

    return {
      modelColor
    }
  }
})
</script>

<style lang="scss">
.color-type {
  display: flex;
  font-size: 12px;
  .name {
    width: 60px;
    height: 30px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text-color;
    background: $secondary-color;
    user-select: none;
  }
  .value {
    flex: 1;
    height: 30px;
    min-width: 100px;
    padding: 0 12px;
    border: 0;
    color: $text-color;
    background: $highlight-color;
    box-sizing: content-box;
  }
}
</style>
