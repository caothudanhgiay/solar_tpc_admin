import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../views/TsoLogin.vue'
import Dashboard from '../views/TsoDashboard.vue'
import Layout from '../views/layout/TsoLayout.vue'
import ProjectManagement from '../views/master_data/projects/TsoProjectManagement.vue'
import UserManagement from '../views/master_data/users/TsoUserManagement.vue'
import AssetManagement from '../views/master_data/assets/TsoAssetManagement.vue'
import ServiceManagement from '../views/master_data/services/TsoServiceManagement.vue'
import ItemManagement from '../views/master_data/items/TsoItemManagement.vue'
import { LocalStorageUtils } from '../utils/LocalStorageUtils'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'TsoLogin',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'TsoDashboard',
        component: Dashboard
      },
      {
        path: 'projects',
        name: 'TsoProjectManagement',
        component: ProjectManagement
      },
      {
        path: 'users',
        name: 'TsoUserManagement',
        component: UserManagement
      },
      {
        path: 'assets',
        name: 'TsoAssetManagement',
        component: AssetManagement
      },
      {
        path: 'services',
        name: 'TsoServiceManagement',
        component: ServiceManagement
      },
      {
        path: 'items',
        name: 'TsoItemManagement',
        component: ItemManagement
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

