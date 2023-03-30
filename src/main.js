import { createApp } from 'vue'

import PerfectScrollbar from 'vue3-perfect-scrollbar'
import i18n from './i18n'
import store from './store'
import router from './router'

import App from './App.vue'

const app = createApp(App)

app.use(PerfectScrollbar)
app.use(i18n)
app.use(store)
app.use(router)

app.mount('#app')
