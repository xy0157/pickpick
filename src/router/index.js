import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/food', name: 'FoodPicker', component: () => import('../views/FoodPicker.vue') },
  { path: '/rollcall', name: 'RollCall', component: () => import('../views/RollCall.vue') },
  { path: '/lottery', name: 'Lottery', component: () => import('../views/Lottery.vue') },
  { path: '/yesno', name: 'YesNo', component: () => import('../views/YesNo.vue') },
  { path: '/shopping', name: 'Shopping', component: () => import('../views/Shopping.vue') },
  { path: '/wheel', name: 'Wheel', component: () => import('../views/Wheel.vue') },
  { path: '/history', name: 'History', component: () => import('../views/History.vue') }
]

const router = createRouter({
  history: createWebHistory('/pickpick/'),
  routes
})

export default router
