import { createApp } from 'vue'
import './style.css'
import App from './TsoApp.vue'
import router from './router/index'
import i18n from './i18n'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
