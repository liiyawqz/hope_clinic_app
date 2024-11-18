<script setup>
import CustomerTable from "@/components/CustomerTable.vue";
</script>
<template>
  <div class="patient">
    <CustomerTable/>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

