import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'

// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Tema PrimeVue
import Aura from '@primeuix/themes/aura'

// Componentes PrimeVue (adicione conforme necessidade)
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Configuração PrimeVue
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

// Registrar componentes globalmente
app.component('Card', Card)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)

app.mount('#app')