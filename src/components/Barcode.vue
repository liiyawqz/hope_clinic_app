<template>
  <div class="barcode">
  <svg ref="barcode"></svg>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import JsBarcode from 'jsbarcode'

const props = defineProps({
  value: String
})

const barcode = ref(null)

const renderBarcode = () => {
  if (barcode.value && props.value) {
    JsBarcode(barcode.value, props.value, {
      format: 'CODE128',
      displayValue: true,
      width: 1,
      height: 25
    })
  }
}

onMounted(renderBarcode)
watch(() => props.value, renderBarcode)
</script>
<style scoped>
</style>
