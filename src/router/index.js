//router\index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import api from '@/axios'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/equipment',
    name: 'equipment',
    component: () => import('../views/EquipmentView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/patient',
    name: 'patient',
    component: () => import('../views/PatientView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/OrderView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('../views/ReportView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/details/:id',
    name: 'Details',
    component: () => import('@/components/DetailsPage.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue'),
  },
  {
    path: '/administrator',
    name: 'administrator',
    component: () => import('../views/adminPanel.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('accessToken')

  if (to.meta.requiresAuth && !accessToken) {
    // если маршрут требует авторизации, а токена нет
    next({ name: 'login' })
  } else if (to.name === 'login' && accessToken) {
    // если уже авторизован и идёт на /login — редиректим на главную
    next({ name: 'home' })
  } else {
    // в остальных случаях — разрешаем переход
    next()
  }
})

export default router
