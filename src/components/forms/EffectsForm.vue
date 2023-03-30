<template>
  <div class="effects-form forms">
    <div class="effect-field form-fields">
      <span class="name">{{$t('enableLamp')}}</span>
      <label class="switch">
        <input ref="powerCheck" type="checkbox" @change="setPowerState">
        <span class="slider"></span>
      </label>
    </div>

    <div class="effect-field form-fields">
      <span class="name">{{$t('effectName')}}</span>
      <select
        class="value"
        @change="setCurrentEffect"
      >
        <option
          class="effect-options"
          v-for="effect in settings"
          :key="effect.id"
          :value="effect.id"
          :selected="effect.id === currentEffect"
        >
          {{effect.name}}
        </option>
      </select>
    </div>

    <div class="brightness-field form-fields">
      <span class="name">{{$t('effectBrightness')}}</span>
      <input
        type="range"
        min="1"
        max="255"
        step="1"
        class="value"
        :value="settings[currentEffect]?.brightness ?? 100"
        @change="changeBrightness"
      />
    </div>

    <div class="speed-field form-fields">
      <span class="name">{{$t('effectSpeed')}}</span>
      <input
        type="range"
        min="1"
        max="255"
        step="1"
        class="value"
        :value="settings[currentEffect]?.speed ?? 100"
        @change="changeSpeed"
      />
    </div>

    <div class="scale-field form-fields">
      <span class="name">{{$t('effectScale')}}</span>
      <input
        type="range"
        min="1"
        max="255"
        step="1"
        class="value"
        :value="settings[currentEffect]?.scale ?? 100"
        @change="changeScale"
      />
    </div>

    <button
      class="select-buttons"
      @click="sendEffects"
    >
      {{$t('saveChanges')}}
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      enableLamp: false,
      settings: [],
      currentEffect: 0
    }
  },
  methods: {
    changeBrightness (event) {
      this.settings[this.currentEffect].brightness = event.target.value
    },
    changeSpeed (event) {
      this.settings[this.currentEffect].speed = event.target.value
    },
    changeScale (event) {
      this.settings[this.currentEffect].scale = event.target.value
    },
    setCurrentEffect (event) {
      this.currentEffect = event.target.selectedIndex
    },
    setPowerState () {
      this.enableLamp = this.$refs.powerCheck.checked
    },
    sendEffects () {
      const xhr = new XMLHttpRequest()

      const body = {
        enableLamp: this.enableLamp,
        settings: this.settings,
        currentEffect: this.currentEffect
      }

      xhr.open('POST', '/setEffects', true)

      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.send(JSON.stringify(body))
    }
  },
  mounted () {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', '/getEffects', true)

    xhr.onload = () => {
      if (xhr.status === 200) {
        const json = JSON.parse(xhr.response)

        this.enableLamp = json.enableLamp
        this.settings = json.settings
        this.currentEffect = json.currentEffect

        this.$refs.powerCheck.checked = this.enableLamp
      }
    }

    xhr.send()
  }
})
</script>

<style lang="scss" scoped>
.effect-options {
  height: 40px;
  font-size: 16px;
}
</style>
