import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue' // создадим страницу для авторизации

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthView
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/equipment',
    name: 'equipment',
    component: () => import('../views/EquipmentView.vue')
  },
  {
    path: '/patient',
    name: 'patient',
    component: () => import('../views/PatientView.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/OrderView.vue')
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('../views/ReportView.vue')
  },
  {
    path: '/details/:id',
    name: 'Details',
    component: () => import('@/components/DetailsPage.vue'),
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Проверка перед каждой навигацией
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && to.name !== 'auth') {
    // Если нет токена и не на странице авторизации — гоним на /auth
    next({ name: 'auth' })
  } else if (token && to.name === 'auth') {
    // Если уже залогинен и попал на /auth — кидаем на главную
    next({ name: 'home' })
  } else {
    // Иначе норм, пропускаем
    next()
  }
})

// Workaround for Vite dynamic import error
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
