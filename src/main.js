import '@babel/polyfill'
import 'mutationobserver-shim'
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import piniaPersist from 'pinia-plugin-persist'
import './plugins/bootstrap-vue'


createApp(App)
  .use(createPinia().use(piniaPersist))
  .use(router)
  .mount('#app')
