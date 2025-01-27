<script setup>
import { useTheme } from 'vuetify';
import { RouterLink } from 'vue-router';
import {faLightbulb, faHospital, faMoon, faUser} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

const theme = useTheme();
const isDark = ref(theme.global.name === 'dark');

function changeDarkMode() {
  isDark.value = !isDark.value;
  theme.global.name = isDark.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme.global.name);
}
</script>

<template>
  <header>
    <a href="/" class="logo">
      <font-awesome-icon :icon="['fas', 'hospital']" />
      <font-awesome-icon v-if="!isDark" :icon="faHospital"/>
      <font-awesome-icon class="icon-item" v-if="isDark" :icon="faHospital"/>
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
      <v-btn
        class="ma-2"
        color="secondary"
        @click="changeDarkMode"
      >
        <font-awesome-icon :icon="['fas', 'moon']" />
        <font-awesome-icon v-if="!isDark" :icon="faMoon"/>
        <font-awesome-icon v-if="isDark" :icon="faLightbulb"/>
      </v-btn>
       <font-awesome-icon class="icon" :icon="['fas', 'user']" />
       <font-awesome-icon class="icon" v-if="!isDark" :icon="faUser"/>
       <font-awesome-icon class="icon" v-if="isDark" :icon="faUser"/>
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
  color: white;
  transition: background-color 0.3s, color 0.3s;
}

.logo {
  color: var(--text-color);
  display: flex;
  align-items: center;
  font-size: 27px;
  gap: 10px;
}
.ma-2{
  background-color: black;
  width: 25px;
  height: 25px;
  border-radius:50%;
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
  margin-top: 15px;
  cursor: pointer;
}
</style>
