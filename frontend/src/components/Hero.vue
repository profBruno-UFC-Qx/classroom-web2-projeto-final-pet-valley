<template>
  <section class="hero-section bg-light py-5">
    <div class="container text-center">
      <h1 class="display-4 text-primary mb-3">
        <i class="pi pi-paw me-3"></i>
        Bem-vindo ao Pet Valley
      </h1>
      <p class="lead text-muted mb-4">O melhor cuidado para o seu melhor amigo</p>
      <Button label="Começar Agora" icon="pi pi-arrow-right" class="p-button-primary p-button-lg" />
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
</script>

<style scoped>
.hero-section {
  padding: 4rem 0;
}
</style>
