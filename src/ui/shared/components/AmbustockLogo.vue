<script setup lang="ts">
interface Props {
  className?: string
}

defineProps<Props>()
</script>

<template>
  <img 
    src="/logo1Rojo.png" 
    alt="AmbuStock Logo" 
    :class="className"
    class="ambustock-logo"
  />
</template>

<style scoped lang="scss">
.ambustock-logo {
  height: auto;
  max-width: 200px;
}
</style>
