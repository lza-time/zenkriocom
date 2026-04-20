// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
// ✅ 正确引入路由配置
import router from './router'

const app = createApp(App)
// ✅ 必须挂载路由，router-view 才能被识别
app.use(router)
app.mount('#app')