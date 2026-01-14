<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="/logo.png" style="width: 30px; height: auto; margin-right: 8px" alt="" />
            <h3 class="sidebar-title">Pet Valley</h3>
        </div>

        <ul class="sidebar-menu">
            <!-- ADMIN -->
            <template v-if="isAdmin">
                <li class="sidebar-item" @click="go('/admin/dashboard')">
                    <i class="pi pi-chart-line"></i>
                    <span>Dashboard</span>
                </li>

                <li class="sidebar-item" @click="go('/admin/usuarios')">
                    <i class="pi pi-users"></i>
                    <span>Gerenciar usuários</span>
                </li>

                <li class="sidebar-item" @click="go('/admin/organizacoes')">
                    <i class="pi pi-warehouse"></i>
                    <span>Gerenciar organizações</span>
                </li>

                <li class="sidebar-item" @click="go('/admin/animais')">
                    <i class="pi pi-plus-circle"></i>
                    <span>Cadastrar animais</span>
                </li>

                <!-- <li class="sidebar-item" @click="go('/admin/perfil')">
                    <i class="pi pi-user-edit"></i>
                    <span>Alterar dados</span>
                </li> -->
            </template>

            <!-- ORGANIZATION -->
            <template v-if="isOrganization">
                <li class="sidebar-item" @click="go('/org/animais')">
                    <i class="pi pi-objects-column"></i>
                    <span>Animais</span>
                </li>
                <li class="sidebar-item" @click="go('/org/perfil')">
                    <i class="pi pi-user"></i>
                    <span>Perfil</span>
                </li>
                <li class="sidebar-item" @click="go('/org/endereco')">
                    <i class="pi pi-map-marker"></i>
                    <span>Endereço</span>
                </li>

                <!-- <li class="sidebar-item" @click="go('/adocoes')"> -->
                <li class="sidebar-item">
                    <i class="pi pi-heart"></i>
                    <span>Adoções</span>
                </li>
            </template>

            <li class="sidebar-item" @click="authStore.logout()">
                <i class="pi pi-sign-out"></i>
                <span>Sair</span>
            </li>
        </ul>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.user?.role === 'admin')
const isOrganization = computed(() => authStore.user?.role === 'organization')

const go = (path: string) => {
    router.push(path)
}
</script>

<style scoped>
.sidebar {
    width: 260px;
    height: 100vh;
    background-color: var(--secondary);
    border-right: 1px solid var(--surface-border);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
}

.sidebar-header {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--surface-border);
}

.sidebar-title {
    margin: 0;
    font-size: 1.2rem;
    color: var(--support);
}

.sidebar-menu {
    list-style: none;
    padding: 1rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sidebar-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    color: var(--support);
    transition: background-color 0.2s;
}

.sidebar-item:hover {
    background-color: #1a5a57;
}

.sidebar-item i {
    font-size: 1.1rem;
}
</style>
