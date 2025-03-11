import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../stores/tokenstore'; // 确保 Vuex 2 版本

import Login from '../components/login.vue';
import Register from '../components/register.vue';
import Diagram from '../components/Diagram.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' }, // 🚀 进入 "/" 时，默认跳转到登录页
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/diagram',
    component: Diagram,
    meta: { requiresAuth: true } // 🚀 需要登录才能进入
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

// 🚀 **拦截未登录的用户，跳转到 /login**
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.token; // 读取 Vuex 里的 token
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login'); // 🚨 未登录，跳转到登录页
  } else {
    next(); // ✅ 已登录，正常访问
  }
});

export default router;

