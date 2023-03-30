<template>
  <perfect-scrollbar class="home-scroll">
    <EffectsBox />
    <WiFiBox />
  </perfect-scrollbar>
</template>

<script>
import { mapActions } from 'vuex'

import EffectsBox from '../components/boxes/EffectsBox.vue'
import WiFiBox from '../components/boxes/WiFiBox.vue'

export default {
  name: 'HomePage',
  components: {
    EffectsBox,
    WiFiBox
  },
  methods: {
    ...mapActions({
      loadSettings: 'lamp/loadSettings'
    })
  }
}
</script>

<style lang="scss">
@import url('@/assets/scss/scrollbar.scss');
@import url('@/assets/scss/switch.scss');

.home-scroll {
  position: relative;
  width: 100%;
  height: 0px !important;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: center;
  background-color: $background-color;
}
</style>
