<template>
  <section class="pricing-section py-5 bg-white">
    <div class="container">
      <h2 class="text-center mb-5">Nossos Planos</h2>
      <div class="row">
        <div class="col-md-4 mb-4" v-for="plan in plans" :key="plan.name">
          <Card class="h-100">
            <template #title>{{ plan.name }}</template>
            <template #content>
              <div class="text-center mb-4">
                <span class="display-6 text-primary">{{ plan.price }}</span>
                <span class="text-muted">/mês</span>
              </div>
              <ul class="list-unstyled">
                <li v-for="feature in plan.features" :key="feature" class="mb-2">
                  <i class="pi pi-check text-success me-2"></i>
                  {{ feature }}
                </li>
              </ul>
            </template>
            <template #footer>
              <Button :label="plan.buttonText" :class="plan.buttonClass" class="w-100" />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'

const plans = ref([
  {
    name: 'Básico',
    price: 'R$ 29',
    features: ['Banho e Tosa', 'Consulta Básica', 'Vacinação'],
    buttonText: 'Escolher Plano',
    buttonClass: 'p-button-outlined',
  },
  {
    name: 'Intermediário',
    price: 'R$ 59',
    features: ['Todos do Básico', 'Hotel Pet', 'Adestramento Básico', 'Exames Laboratoriais'],
    buttonText: 'Mais Popular',
    buttonClass: 'p-button-primary',
  },
  {
    name: 'Premium',
    price: 'R$ 99',
    features: ['Todos do Intermediário', 'Fisioterapia', 'Acupuntura', 'Emergência 24h'],
    buttonText: 'Melhor Custo',
    buttonClass: 'p-button-success',
  },
])
</script>
