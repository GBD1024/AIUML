import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from "axios";
import store from './stores/tokenstore'; // 这里要确保路径正确
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.prototype.$axios = axios; // 全局注册 axios

Vue.config.productionTip = false;

new Vue({
  router,
  store, // 确保 Vuex 加载
  render: h => h(App)
}).$mount('#app');
