<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <header>
    <a href="#" class="logo">
      <img class="image" alt="Hope logo" src="@/assets/logo2.svg" width="35" height="35" />
      <span class="logo-text">HopeClinic</span>
    </a>

    <nav>
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/equipment">Оборудование</RouterLink>
      <RouterLink to="/patient">Клиенты</RouterLink>
      <RouterLink to="/order">Аренда</RouterLink>
      <RouterLink to="/report">Отчеты</RouterLink>
    </nav>

    <div class="icons">
      <img alt="settings logo" class="icon" src="@/assets/settings.png" width="30" height="30" />
      <img alt="user logo" class="icon" src="@/assets/user2.webp" width="30" height="30" />
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

.logo {
  display: flex;
  align-items: center;
  font-size: 27px;
  gap: 10px;
}

nav {
  display: flex;
  gap: 80px;
  font-size: 16px;
}

nav a {
  text-decoration: none;
  font-size: 16px;
  color: #726666;
  font-family: inherit;
}

nav a.router-link-exact-active {
  color: #1861FF;
}

.icons {
  display: flex;
  gap: 30px;
}

.icon {
  cursor: pointer;
}
</style>
