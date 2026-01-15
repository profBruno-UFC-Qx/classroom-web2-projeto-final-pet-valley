<template>
    <section class="py-5" style="background-color: var(--accent)">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-8 text-white">
                    <h3 class="mb-3">Pronto para mudar uma vida?</h3>
                    <p class="mb-0">
                        Cadastre-se agora e comece sua jornada de adoção ou ajude uma organização de proteção
                        animal.
                    </p>
                </div>
                <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
                    <RouterLink to="/cadastro" class="btn btn-primary btn-lg me-2">Quero Adotar</RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>