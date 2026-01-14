<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container-fluid d-flex justify-content-between align-items-center px-4">
      <!-- Logo e nome -->
      <RouterLink class="navbar-brand fw-bold d-flex align-items-center" to="/">
        <img src="/logo.png" style="width: 30px; height: auto; margin-right: 8px" alt="" />
        <span style="color: var(--support)">Pet Valley</span>
      </RouterLink>

      <!-- Botão toggle (mobile) -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Início</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/#sobre-nos">Sobre nós</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/#como-funciona">Adoção</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/animais">Animais</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/#footer">Contato</RouterLink>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item ms-lg-3" style="display: flex; align-items: center;">
            <UserAvatar />
          </li>
          <li v-else class="nav-item ms-lg-3">
            <RouterLink class="btn btn-primary" to="/login">Login</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import UserAvatar from './UserAvatar.vue'
const authStore = useAuthStore()

</script>
