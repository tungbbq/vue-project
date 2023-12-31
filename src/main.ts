import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// @ts-ignore
import router from './router'
import VueCookies from 'vue-cookies'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css'


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueCookies, { expires: '7d'})
app.mount('#app')


