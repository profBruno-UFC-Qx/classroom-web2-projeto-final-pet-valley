<template>
  <div class="main-content">
    <Navbar />
    
    <!-- Hero Section -->
    <Hero />

    <!-- Steps Section -->
    <section id="como-funciona" class="steps-section">
      <div class="container">
        <h2 class="section-title text-center">Como Funciona a Adoção</h2>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="step-card text-center">
              <div class="step-icon">
                <i class="bi bi-search"></i>
              </div>
              <h4>Encontre</h4>
              <p>
                Navegue pelos perfis de animais disponíveis para adoção. Use
                filtros para encontrar o pet ideal para você.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="step-card text-center">
              <div class="step-icon">
                <i class="bi bi-file-text"></i>
              </div>
              <h4>Candidate-se</h4>
              <p>
                Preencha o formulário de interesse e aguarde o contato da
                organização responsável pelo animal.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="step-card text-center">
              <div class="step-icon">
                <i class="bi bi-house-door"></i>
              </div>
              <h4>Visita</h4>
              <p>
                Agende uma visita para conhecer o animal pessoalmente e passar
                por uma entrevista com a organização.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="step-card text-center">
              <div class="step-icon">
                <i class="bi bi-heart"></i>
              </div>
              <h4>Adote</h4>
              <p>
                Finalize a documentação e leve seu novo amigo para casa!
                Oferecemos suporte pós-adoção.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section bg-light">
      <div class="container">
        <h2 class="section-title text-center">Por que Escolher o Pet Valley?</h2>
        <div class="row g-4">
          <div class="col-md-6 col-lg-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-shield-check"></i>
              </div>
              <h4>Processo Seguro</h4>
              <p>
                Todas as organizações são verificadas e o processo de adoção é
                transparente e responsável.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-people"></i>
              </div>
              <h4>Suporte Contínuo</h4>
              <p>
                Oferecemos orientação antes, durante e depois da adoção para
                garantir uma transição tranquila.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-heart-pulse"></i>
              </div>
              <h4>Saúde Garantida</h4>
              <p>
                Todos os animais são vacinados, vermifugados e castrados antes
                da adoção.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <h4>Encontre Perto de Você</h4>
              <p>
                Busque animais disponíveis em organizações próximas à sua
                localização.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-chat-dots"></i>
              </div>
              <h4>Comunidade Ativa</h4>
              <p>
                Conecte-se com outros adotantes e compartilhe experiências em
                nossa comunidade.
              </p>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="bi bi-graph-up"></i>
              </div>
              <h4>Impacto Real</h4>
              <p>
                A cada adoção, você ajuda a liberar espaço para que mais animais
                sejam resgatados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5" style="background-color: var(--accent)">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8 text-white">
            <h3 class="mb-3">Pronto para mudar uma vida?</h3>
            <p class="mb-0">
              Cadastre-se agora e comece sua jornada de adoção ou ajude uma
              organização de proteção animal.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <RouterLink to="/cadastro" class="btn btn-primary btn-lg me-2">Quero Adotar</RouterLink>
            <RouterLink to="/organizacoes/cadastro" class="btn btn-outline-light btn-lg">Sou Organização</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import Footer from '@/components/Footer.vue'
import { RouterLink } from 'vue-router'
</script>
