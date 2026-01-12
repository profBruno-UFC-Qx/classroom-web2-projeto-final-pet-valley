<template>
  <h2 class="section-title" :class="textCenter ? 'text-center' : ''">
    {{ title }}
  </h2>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  textCenter?: boolean
}>()
</script>

<style scoped>
.section-title {
  color: var(--accent);
  margin-bottom: 50px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--primary);
}

.text-center.section-title::after {
  left: 50%;
  transform: translateX(-50%);
}
</style>
