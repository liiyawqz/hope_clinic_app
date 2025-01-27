<script setup>
import {faHospital} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faInstagram, faYoutube} from "@fortawesome/free-brands-svg-icons";
</script>

<template>
  <footer>
    <div class="footer-logo">
      <a href="#" class="logo">
        <font-awesome-icon :icon="['fas', 'hospital']" />
        <font-awesome-icon v-if="!isDark" :icon="faHospital"/>
        <font-awesome-icon v-if="isDark" :icon="faHospital"/>
        <span class="logo-text">HopeClinic</span>
      </a>
      <a href="#" class="logo">
        <span class="logo-text">© 2024 Hope Clinic. All rights reserved.</span>
        <font-awesome-icon :icon="['fab', 'instagram']" />
        <font-awesome-icon v-if="!isDark" :icon="faInstagram"/>
        <font-awesome-icon v-if="isDark" :icon="faInstagram"/>
        <font-awesome-icon :icon="['fab', 'youtube']" />
        <font-awesome-icon v-if="!isDark" :icon="faYoutube"/>
        <font-awesome-icon v-if="isDark" :icon="faYoutube"/>
      </a>

    </div>
  </footer>

</template>

<style scoped>
:root[data-theme="dark"] footer {
  background-color: #000000;
  color: white;
  transition: background-color 0.3s, color 0.3s;
}
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #F1F5F9;
}

.footer-logo .logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.footer-logo{
  color: var(--text-color);
}
.logo-text {
  margin-left: 10px;
  font-size: 18px;
  color: #333;
}


</style >
