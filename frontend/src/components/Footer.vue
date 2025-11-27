<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-4 mb-lg-0">
          <h4 class="mb-3">
            <i class="bi bi-heart-fill me-2"></i>Pet Valley
          </h4>
          <p>
            Conectando animais que precisam de um lar com pessoas dispostas a
            oferecer amor e cuidado.
          </p>
          <div class="social-icons">
            <a href="#"><i class="bi bi-facebook"></i></a>
            <a href="#"><i class="bi bi-instagram"></i></a>
            <a href="#"><i class="bi bi-twitter"></i></a>
            <a href="#"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
        <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
          <h5 class="mb-3">Links Rápidos</h5>
          <div class="footer-links d-flex flex-column">
            <RouterLink to="/" class="mb-2">Início</RouterLink>
            <RouterLink to="/sobre" class="mb-2">Sobre Nós</RouterLink>
            <RouterLink to="/animais" class="mb-2">Animais</RouterLink>
            <RouterLink to="/organizacoes" class="mb-2">Organizações</RouterLink>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <h5 class="mb-3">Recursos</h5>
          <div class="footer-links d-flex flex-column">
            <RouterLink to="/blog" class="mb-2">Blog</RouterLink>
            <RouterLink to="/faq" class="mb-2">Perguntas Frequentes</RouterLink>
            <RouterLink to="/termos" class="mb-2">Termos de Uso</RouterLink>
            <RouterLink to="/privacidade" class="mb-2">Política de Privacidade</RouterLink>
          </div>
        </div>
        <div class="col-lg-3">
          <h5 class="mb-3">Contato</h5>
          <div class="footer-links d-flex flex-column">
            <p class="mb-2">
              <i class="bi bi-geo-alt me-2"></i> São Paulo, SP
            </p>
            <p class="mb-2">
              <i class="bi bi-telephone me-2"></i> (11) 9999-9999
            </p>
            <p class="mb-2">
              <i class="bi bi-envelope me-2"></i> contato@petvalley.com
            </p>
          </div>
        </div>
      </div>
      <hr class="my-4" style="border-color: rgba(255, 255, 255, 0.1)" />
      <div class="text-center">
        <p class="mb-0">&copy; {{ new Date().getFullYear() }} Pet Valley. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
