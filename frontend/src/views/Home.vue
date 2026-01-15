<template>
  <div class="main-content">
    <Navbar />

    <Hero />

    <About />

    <AdoptionSteps />

    <Features />
    
    <ToRegister v-if="!authStore.isAuthenticated" />

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Hero from '@/components/Hero.vue'
import Footer from '@/components/Footer.vue'
import About from '@/components/About.vue';
import AdoptionSteps from '@/components/AdoptionSteps.vue';
import Features from '@/components/Features.vue';
import ToRegister from '@/components/ToRegister.vue';

import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
</script>