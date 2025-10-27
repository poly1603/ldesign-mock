import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import MockManager from '../views/MockManager.vue'
import Logs from '../views/Logs.vue'
import Scenarios from '../views/Scenarios.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/mocks',
      name: 'Mocks',
      component: MockManager,
    },
    {
      path: '/logs',
      name: 'Logs',
      component: Logs,
    },
    {
      path: '/scenarios',
      name: 'Scenarios',
      component: Scenarios,
    },
  ],
})

export default router

