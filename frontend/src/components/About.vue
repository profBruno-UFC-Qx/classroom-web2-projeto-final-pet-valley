<template>
  <section id="sobre-nos" class="about-section">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 mb-5 mb-lg-0">
          <h2 class="section-title">Sobre o Pet Valley</h2>
          <p class="lead mb-4">
            Somos um portal de adoção de animais que conecta pessoas que desejam adotar pets com organizações de
            proteção animal.
          </p>
          <p>
            Nosso objetivo é facilitar o processo de adoção, promovendo lares amorosos para animais resgatados e
            abandonados.
            Oferecemos uma plataforma intuitiva onde os usuários podem navegar por perfis de animais disponíveis,
            candidatar-se
            para adoção e receber suporte durante todo o processo.
          </p>
          <p class="mb-4">
            Junte-se a nós na missão de transformar vidas e proporcionar um futuro melhor para nossos amigos de quatro
            patas.
          </p>
          <RouterLink to="/animais" class="btn btn-primary btn-lg">
            Ver animais disponíveis
          </RouterLink>
        </div>

        <div class="col-lg-6">
          <div class="about-image-wrapper">
            <img src="/cao-duvida.jpg" alt="Grupo de animais adotados felizes" class="about-image" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 8rem 0;
  background-color: var(--surface-ground);
  /* ou #f8f9fa / branco suave */
}

.about-section .section-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.about-section .lead {
  font-size: 1.35rem;
  font-weight: 500;
  color: var(--text-color-secondary);
  line-height: 1.6;
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.about-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s ease;
}

/* Responsividade */
@media (max-width: 992px) {
  .about-section {
    padding: 6rem 0;
  }

  .about-section .section-title {
    font-size: 2.4rem;
  }
}
</style>