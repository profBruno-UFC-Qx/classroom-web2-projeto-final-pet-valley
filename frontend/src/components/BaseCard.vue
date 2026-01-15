<template>
  <div class="base-card" :class="[hoverable ? 'base-card--hoverable' : '']">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hoverable?: boolean
}>()
</script>

<style scoped>
.base-card {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  height: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.base-card--hoverable:hover {
  transform: translateY(-10px);
}
</style>
