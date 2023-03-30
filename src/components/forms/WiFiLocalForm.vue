<template>
  <div class="wifi-ap-form forms">
    <div class="wifi-ap-field form-fields">
      <span class="name">{{$t('wifiLocalSSID')}}</span>
      <input
        type="text"
        class="value"
        maxlength="32"
        ref="inputSSID"
        :placeholder="$t('placeholderSSID')"
        @input="ssid = $event.target.value"
      />
    </div>

    <div class="wifi-ap-field form-fields">
      <span class="name">{{$t('wifiLocalPass')}}</span>
      <input
        type="password"
        class="value"
        maxlength="63"
        ref="inputPASS"
        :placeholder="$t('placeholderPASS')"
        @input="pass = $event.target.value"
      />
    </div>

    <button
      class="select-buttons"
      @click="sendAP"
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
      ssid: '',
      pass: ''
    }
  },
  methods: {
    sendAP () {
      const xhr = new XMLHttpRequest()

      const body = {
        apSSID: this.ssid,
        apPASS: this.pass
      }

      xhr.open('POST', '/setAP', true)

      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.send(JSON.stringify(body))
    }
  },
  mounted () {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', '/getAP', true)

    xhr.onload = () => {
      if (xhr.status === 200) {
        const json = JSON.parse(xhr.response)

        this.ssid = json.apSSID
        this.pass = json.apPASS

        this.$refs.inputSSID.value = this.ssid
        this.$refs.inputPASS.value = this.pass
      }
    }

    xhr.send()
  }
})
</script>
