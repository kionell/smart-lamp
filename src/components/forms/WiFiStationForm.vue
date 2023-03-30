<template>
  <div class="wifi-sta-form forms">
    <div class="wifi-sta-field form-fields">
      <span class="name">{{$t('wifiEnablePoint')}}</span>
      <label class="switch">
        <input ref="staCheck" type="checkbox" @change="setStaMode">
        <span class="slider"></span>
      </label>
      <span
        v-show="mode && name"
        class="wifi-sta-info text"
      >
        ({{ $t('wifiConnected', { ssid: name }) }})
      </span>
    </div>

    <div class="wifi-sta-field form-fields">
      <span class="name">{{$t('wifiPointSSID')}}</span>
      <input
        type="text"
        class="value"
        maxlength="32"
        ref="inputSSID"
        @input="ssid = $event.target.value"
      />
    </div>

    <div class="wifi-sta-field form-fields">
      <span class="name">{{$t('wifiPointPass')}}</span>
      <input
        type="password"
        class="value"
        maxlength="63"
        ref="inputPASS"
        @input="pass = $event.target.value"
      />
    </div>

    <button
      class="select-buttons"
      @click="sendSTA"
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
      name: '',
      ssid: '',
      pass: '',
      mode: false
    }
  },
  methods: {
    setStaMode () {
      this.mode = this.$refs.staCheck.checked
    },
    sendSTA () {
      const xhr = new XMLHttpRequest()

      const body = {
        staSSID: this.ssid,
        staPASS: this.pass,
        staMode: this.mode
      }

      xhr.open('POST', '/setSTA', true)

      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.send(JSON.stringify(body))
    }
  },
  mounted () {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', '/getSTA', true)

    xhr.onload = () => {
      if (xhr.status === 200) {
        const json = JSON.parse(xhr.response)

        this.name = json.staName
        this.ssid = json.staSSID
        this.mode = json.staMode

        this.$refs.inputSSID.value = this.ssid
        this.$refs.staCheck.checked = this.mode
      }
    }

    xhr.send()
  }
})
</script>

<style lang="scss" scoped>
.wifi-sta-info {
  margin-left: 20px;
}
</style>
