<template>
    <div class="user-menu-cssonly">
        <input id="menu-toggle" class="menu-toggle" type="checkbox" />

        <label for="menu-toggle" class="avatar" aria-haspopup="true" aria-controls="user-menu">
            <i class="pi pi-user avatar-icon" aria-hidden="true"></i>
        </label>

        <nav id="user-menu" class="menu" role="menu" aria-hidden="true">
            <router-link to="/adopter/perfil" class="menu-item" role="menuitem">
                <i class="pi pi-user"></i><span>Perfil</span>
            </router-link>

            <router-link to="/adopter/endereco" class="menu-item" role="menuitem">
                <i class="pi pi-map-marker"></i><span>Endereço</span>
            </router-link>

            <router-link to="/adocoes" class="menu-item" role="menuitem">
                <i class="pi pi-heart"></i><span>Adoções</span>
            </router-link>

            <Divider />

            <a href="/logout" @click="authStore.logout()" class="menu-item logout" role="menuitem">
                <i class="pi pi-sign-out"></i><span>Sair</span>
            </a>
        </nav>

        <label for="menu-toggle" class="overlay" aria-hidden="true"></label>
    </div>
</template>

<style scoped>
.user-menu-cssonly {
    position: relative;
    display: inline-block;
}

.menu-toggle {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.avatar {
    display: inline-flex;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ece9fc;
    color: #2a1261;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid rgba(0, 0, 0, 0.06);
}

.menu {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    min-width: 200px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 6px 0;
    display: none;
    z-index: 60;
    transform-origin: top right;
    transition: opacity .15s ease, transform .15s ease;
    opacity: 0;
    transform: translateY(-6px) scale(.98);
}

.menu-toggle:checked+label.avatar+.menu {
    display: block;
    opacity: 1;
    transform: translateY(0) scale(1);
}

.menu-item {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .6rem 1rem;
    color: #222;
    text-decoration: none;
    font-size: 0.95rem;
}

.menu-item i {
    font-size: 1.05rem;
    color: #555;
}

.menu-item:hover {
    background: #f5f5f7;
}

.menu-item.logout {
    color: #c23a3a;
}

.menu-item.logout i {
    color: #c23a3a;
}

.overlay {
    display: none;
}

.menu-toggle:checked~.overlay {
    position: fixed;
    inset: 0;
    display: block;
    z-index: 50;
    background: transparent;
    cursor: default;
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

</script>