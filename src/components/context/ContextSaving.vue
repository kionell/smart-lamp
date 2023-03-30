<template>
  <a class="context-saving" @click="saveFile">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 528 528" width="30" height="30">
      <path d="M346,422H166c-8.284,0-15,6.716-15,15s6.716,15,15,15h180c8.284,0,15-6.716,15-15S354.284,422,346,422z" fill="#FFFFFF" stroke="#000000" stroke-width="15"/>
      <path d="M346,302H166c-8.284,0-15,6.716-15,15s6.716,15,15,15h180c8.284,0,15-6.716,15-15S354.284,302,346,302z" fill="#FFFFFF" stroke="#000000" stroke-width="15"/>
      <path d="M346,362H166c-8.284,0-15,6.716-15,15s6.716,15,15,15h180c8.284,0,15-6.716,15-15S354.284,362,346,362z" fill="#FFFFFF" stroke="#000000" stroke-width="15"/>
      <rect x="121" width="210" height="130" fill="#FFFFFF" stroke="#000000" stroke-width="15"/>
      <path d="M507.606,84.394l-80-80C424.793,1.581,420.978,0,417,0h-56v145c0,8.284-6.716,15-15,15H106c-8.284,0-15-6.716-15-15V0H15
        C6.716,0,0,6.716,0,15v482c0,8.284,6.716,15,15,15c4.645,0,475.762,0,482,0c8.284,0,15-6.716,15-15V95
        C512,91.022,510.419,87.207,507.606,84.394z M391,482H121V272h270V482z" fill="#FFFFFF" stroke="#000000" stroke-width="15"/>
    </svg>
  </a>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters({
      dataURL: 'drawer/getCurrentDataURL'
    })
  },
  methods: {
    saveFile () {
      this.$el.download = 'canvas.png'
      this.$el.href = this.dataURL
    }
  }
})
</script>

<style lang="scss" scoped>
  .context-saving {
    display: block;
  }
</style>
