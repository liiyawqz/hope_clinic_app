<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { RouterView } from 'vue-router';

</script>

<template>
  <div class="wrapper">
    <Header />
    <main>
        <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
 main{
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F1F5F9;
}

main {
  flex: 1;
  padding: 20px;
}
</style>
