import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import MatrixPage from '../views/MatrixPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/matrix',
    name: 'Matrix',
    component: MatrixPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
