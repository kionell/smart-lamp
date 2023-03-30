<template>
  <div class="color-select">
    <button class="select-buttons">{{$t('selectColor')}}</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    updateValue () {
      this.modelColor = this.validator(this.$refs.colorInput.value)
      this.$refs.colorInput.value = this.modelColor
    }
  }
})
</script>
