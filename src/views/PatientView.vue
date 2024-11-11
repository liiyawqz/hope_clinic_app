<script>
import CustomerTable from "@/components/CustomerTable.vue";
import {defineComponent} from "vue";
import CustomerBoxes from "@/components/CustomerBoxes.vue";

export default defineComponent({
  components: {CustomerBoxes}
})

</script>
<template>
  <div class="patient">
    <CustomerBoxes/>
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

