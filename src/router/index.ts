import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../views/TsoLogin.vue'
import Dashboard from '../views/TsoDashboard.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'TsoLogin',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'TsoDashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route protection guards
router.beforeEach((to, _from, next) => {
  const isLoggedIn = !!localStorage.getItem('solar_admin_token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: 'TsoLogin' })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isLoggedIn) {
      next({ name: 'TsoDashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

