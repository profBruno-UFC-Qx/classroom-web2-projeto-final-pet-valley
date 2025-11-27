<template>
  <section class="hero">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold mb-4">
            Encontre seu novo melhor amigo
          </h1>
          <p class="lead mb-4">
            Conectamos animais que precisam de um lar com pessoas dispostas a
            oferecer amor e cuidado. Faça parte dessa história de amor!
          </p>
          <div class="d-flex flex-wrap gap-3">
            <RouterLink to="/animais" class="btn btn-primary btn-lg">Encontrar um animal</RouterLink>
            <RouterLink to="/sobre" class="btn btn-outline-light btn-lg">Saiba mais</RouterLink>
          </div>
        </div>
        <div class="col-lg-6 text-center mt-5 mt-lg-0">
          <img
            src="https://images.unsplash.com/photo-1583511655826-05700d52f4a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            alt="Cachorro e gato juntos"
            class="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
