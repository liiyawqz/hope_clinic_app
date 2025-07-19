import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Login from '../components/Login.vue';
import { checkAdminRole } from '@/services/authService';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/equipment',
    name: 'equipment',
    component: () => import('../views/EquipmentView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/patient',
    name: 'patient',
    component: () => import('../views/PatientView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/OrderView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('../views/ReportView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/details/:id',
    name: 'Details',
    component: () => import('@/components/DetailsPage.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/administrator',
    name: 'administrator',
    component: () => import('../views/adminPanel.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const accessToken = localStorage.getItem('accessToken');
  console.log('Переход на маршрут:', to.path, 'Токен:', !!accessToken);

  if (to.meta.requiresAuth && !accessToken) {
    console.log('Нет токена, редирект на /login');
    next({ name: 'login' });
  } else if (to.meta.requiresAdmin) {
    const isAdmin = await checkAdminRole();
    console.log('Проверка Admin:', isAdmin);
    if (!isAdmin) {
      console.log('Не админ, редирект на /');
      next({ name: 'home' });
    } else {
      next();
    }
  } else if (to.name === 'login' && accessToken) {
    console.log('Уже авторизован, редирект на /');
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
