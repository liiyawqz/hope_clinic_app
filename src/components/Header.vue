<script setup>
import { useTheme } from 'vuetify';
import { RouterLink } from 'vue-router';
import { faLightbulb, faHospital, faMoon, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, onMounted } from 'vue';
import { logout, checkAdminRole } from '@/services/authService';
import { useRouter } from 'vue-router';

const theme = useTheme();
const router = useRouter();
const isDark = ref(theme.global.name === 'dark');
const isAdmin = ref(false);

onMounted(async () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  theme.global.name = savedTheme;
  isDark.value = savedTheme === 'dark';

  const token = localStorage.getItem('accessToken');
  console.log('Токен в localStorage:', token);
  if (token) {
    isAdmin.value = await checkAdminRole();
    console.log('isAdmin:', isAdmin.value);
  } else {
    console.log('Токен отсутствует в localStorage');
  }
});

function changeDarkMode() {
  isDark.value = !isDark.value;
  theme.global.name = isDark.value ? 'dark' : 'light';
  localStorage.setItem('theme', theme.global.name);
  document.documentElement.setAttribute('data-theme', theme.global.name);
}

function handleLogout() {
  console.log('Выход из системы');
  logout();
  router.push('/login');
}
</script>

<template>
  <header>
    <a href="/" class="logo">
      <font-awesome-icon :icon="['fas', 'hospital']" />
      <font-awesome-icon v-if="!isDark" :icon="faHospital" />
      <font-awesome-icon class="icon-item" v-if="isDark" :icon="faHospital" />
      <span class="logo-text">HopeClinic</span>
    </a>

    <nav>
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/equipment">Оборудование</RouterLink>
      <RouterLink to="/patient">Клиенты</RouterLink>
      <RouterLink to="/order">Аренда</RouterLink>
      <RouterLink to="/report">Отчеты</RouterLink>
      <RouterLink v-if="isAdmin" to="/administrator">Admin</RouterLink>
    </nav>
    <div class="icons">
      <v-btn
        plain
        class="ma-2 bg-transparent switch-color-btn"
        @click="changeDarkMode"
      >
        <font-awesome-icon :icon="['fas', 'moon']" />
        <font-awesome-icon v-if="!isDark" :icon="faMoon" />
        <font-awesome-icon v-if="isDark" :icon="faLightbulb" />
      </v-btn>
      <font-awesome-icon class="icon" :icon="['fas', 'user']" />
      <font-awesome-icon class="icon" v-if="!isDark" :icon="faUser" />
      <font-awesome-icon class="icon" v-if="isDark" :icon="faUser" @click="handleLogout" />
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  background-color: white;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
}

:root[data-theme="dark"] header {
  background-color: #000000;
  color: #f1f5f9;
}

.logo {
  color: var(--text-color);
  display: flex;
  align-items: center;
  font-size: 27px;
  gap: 10px;
}
.ma-2 {
  background-color: black;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
nav {
  display: flex;
  gap: 80px;
  font-size: 16px;
}
a {
  text-decoration: none;
  color: #726666;
}
nav a.router-link-exact-active {
  color: #1861FF;
}
.icons {
  display: flex;
  gap: 20px;
}
.icon {
  margin-top: 10px;
  cursor: pointer;
}
.switch-color-btn {
  box-shadow: none;
  text-decoration: none !important;
}
.v-btn {
  all: unset;
  cursor: pointer;
}
.switch-color-btn:hover {
  text-decoration: none !important;
}
</style>
