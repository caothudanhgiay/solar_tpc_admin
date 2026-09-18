import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { LocalStorageUtils } from '../utils/LocalStorageUtils'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'TsoLogin',
    component: () => import('../views/TsoLogin.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: () => import('../views/layout/TsoLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'TsoDashboard',
        component: () => import('../views/TsoDashboard.vue')
      },
      {
        path: 'projects',
        name: 'TsoProjectManagement',
        component: () => import('../views/master_data/projects/TsoProjectManagement.vue')
      },
      {
        path: 'users',
        name: 'TsoUserManagement',
        component: () => import('../views/master_data/users/TsoUserManagement.vue')
      },
      {
        path: 'assets',
        name: 'TsoAssetManagement',
        component: () => import('../views/master_data/assets/TsoAssetManagement.vue')
      },
      {
        path: 'services',
        name: 'TsoServiceManagement',
        component: () => import('../views/master_data/services/TsoServiceManagement.vue')
      },
      {
        path: 'items',
        name: 'TsoItemManagement',
        component: () => import('../views/master_data/items/TsoItemManagement.vue')
      }
    ]
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Route protection guards
router.beforeEach((to, _from) => {
  const isLoggedIn = !!LocalStorageUtils.getToken()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      return { name: 'TsoLogin' }
    } else {
      return true
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isLoggedIn) {
      return { name: 'TsoDashboard' }
    } else {
      return true
    }
  } else {
    return true
  }
})

export default router

