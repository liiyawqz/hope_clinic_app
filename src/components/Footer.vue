<template>
  <footer>
    <div class="footer-logo">
      <a href="#" class="logo">
        <img class="image" alt="Hope logo" src="@/assets/logo2.svg" width="35" height="35" />
        <span class="logo-text">HopeClinic</span>
      </a>
      <a href="#" class="logo">
        <span class="logo-text">© 2024 Hope Clinic. All rights reserved.</span>
        <img class="image" alt="Instagram logo" src="@/assets/instagram.png" width="45" height="45" />
        <img class="image" alt="YouTube logo" src="@/assets/youtube.png" width="45" height="45" />
      </a>

    </div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #f1f1f1;
  border-top: 1px solid #ddd;
}

.footer-logo .logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-text {
  margin-left: 10px;
  font-size: 18px;
  color: #333;
}


</style >
