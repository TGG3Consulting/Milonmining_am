import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import { i18n } from '@/i18n'
import Toast from "vue-toastification";
import 'flowbite';
import "vue-toastification/dist/index.css";
import 'vue-select/dist/vue-select.css';
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(Toast, {
    position: "bottom-right",
    timeout: 3500,
    closeOnClick: true,
    draggable: true,
    pauseOnHover: true,
});
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')