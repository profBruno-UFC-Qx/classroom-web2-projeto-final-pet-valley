import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/cadastro',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/animais',
      name: 'animals',
      component: () => import('../views/Animals.vue')
    },
    {
      path: '/organizacoes',
      name: 'organizations',
      component: () => import('../views/Organizations.vue')
    },
    {
      path: '/organizacoes/cadastro',
      name: 'organization-register',
      component: () => import('../views/OrganizationRegister.vue')
    },
    {
      path: '/sobre',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/contato',
      name: 'contact',
      component: () => import('../views/Contact.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/Blog.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FAQ.vue')
    },
    {
      path: '/termos',
      name: 'terms',
      component: () => import('../views/Terms.vue')
    },
    {
      path: '/privacidade',
      name: 'privacy',
      component: () => import('../views/Privacy.vue')
    },
    // Rota para página não encontrada - redireciona para Home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

export default router