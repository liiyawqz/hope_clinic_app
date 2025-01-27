import { registerPlugins } from '@/plugins'
import './assets/theme.css';

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import router from './router'
const app = createApp(App)
app.use(router)
registerPlugins(app)

app.mount('#app')
