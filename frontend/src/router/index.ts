import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import { useAuthStore } from '@/stores/authStore'

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
      component: Login,
      meta: { guestOnly: true }
    },
    {
      path: '/cadastro',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/animais',
      name: 'animals',
      component: () => import('../views/Animals.vue')
    },
    {
      path: '/animais/:id',
      name: 'animal-detail',
      component: () => import('../views/AnimalDetail.vue')
    },
    // {
    //   path: '/termos',
    //   name: 'terms',
    //   component: () => import('../views/Terms.vue')
    // },
    {
      path: '/admin',
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        // {
        //   path: 'dashboard',
        //   name: 'admin-dashboard',
        //   component: () => import('../views/admin/Dashboard.vue')
        // },
        {
          path: 'usuarios',
          name: 'admin-users',
          component: () => import('../views/admin/Users.vue')
        },
        {
          path: 'organizacoes',
          name: 'admin-organizations',
          component: () => import('../views/admin/Organizations.vue')
        },
        {
          path: 'animais',
          name: 'admin-animals',
          component: () => import('../views/admin/Animals.vue')
        }
      ]
    },
    {
      path: '/org',
      meta: { requiresAuth: true, role: 'organization' },
      children: [
        {
          path: 'animais',
          name: 'organization-animals',
          component: () => import('../views/organization/Animals.vue')
        },
        {
          path: 'perfil',
          name: 'organization-profile',
          component: () => import('../views/organization/Profile.vue')
        },
        {
          path: 'endereco',
          name: 'organization-address',
          component: () => import('../views/organization/Address.vue')
        },
      ]
    },
    {
      path: '/adopter',
      meta: { requiresAuth: true, role: 'adopter' },
      children: [
        {
          path: 'perfil',
          name: 'adopter-profile',
          component: () => import('../views/adopter/Profile.vue')
        },
        {
          path: 'endereco',
          name: 'address',
          component: () => import('../views/adopter/Address.vue')
        },
      ]
    },
    {
      path: '/adocoes',
      name: 'adoptions',
      component: () => import('../views/Adoptions.vue'),
      meta: { requiresAuth: true, roles: ['organization', 'adopter'] }
    },
    {
      path: '/adocoes/:id',
      name: 'adoption-detail',
      component: () => import('../views/Adoption.vue'),
      meta: { requiresAuth: true, roles: ['organization', 'adopter'] }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

//  GUARD GLOBAL (CanActivate)
router.beforeEach((to) => {
  const auth = useAuthStore()

  // 1) Rotas apenas para visitantes (login / cadastro)
  if (to.meta.guestOnly && auth.isAuthenticated) {
    // usuário logado não pode ver páginas de guest
    switch (auth.user?.role) {
      case 'admin':
        return '/admin/usuarios'
      case 'organization':
        return '/org/animais'
      case 'adopter':
        return '/'
      default:
        return '/login'
    }
  }

  // 2) Rotas que exigem autenticação
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  // 3) Controle genérico por role nas rotas que definem meta.role
  if (to.meta.role && auth.isAuthenticated && auth.user?.role !== to.meta.role) {
    // usuário logado, mas sem permissão para essa rota -> mandar para painel por role
    switch (auth.user?.role) {
      case 'admin':
        return '/admin/usuarios'
      case 'organization':
        return '/org/animais'
      case 'adopter':
        return '/'
      default:
        return '/login'
    }
  }

  // 3.5) Controle por múltiplas roles (meta.roles como array)
  if (to.meta.roles && auth.isAuthenticated) {
    const allowedRoles = to.meta.roles as string[]
    if (!allowedRoles.includes(auth.user?.role || '')) {
      // usuário logado, mas sem permissão para essa rota
      switch (auth.user?.role) {
        case 'admin':
          return '/admin/usuarios'
        case 'organization':
          return '/org/animais'
        case 'adopter':
          return '/'
        default:
          return '/login'
      }
    }
  }

  // 4) Caso especial: rota "/" (landing). 
  //    - Se for visitante => permite (landing pública).
  //    - Se estiver logado E for adopter => permite.
  //    - Se estiver logado E for outro papel => redireciona para painel apropriado.
  if (to.path === '/' && auth.isAuthenticated && auth.user?.role !== 'adopter') {
    switch (auth.user?.role) {
      case 'admin':
        return '/admin/usuarios'
      case 'organization':
        return '/org/animais'
      default:
        return '/login'
    }
  }
})

export default router
