<template>
    <Sidebar />

    <main class="page-content">
        <router-view />
    </main>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.page-content {
    background-color: var(--surface-ground) !important;
    margin-left: 260px;
    /* mesma largura da sidebar */
    padding: 2rem;
}
</style>
