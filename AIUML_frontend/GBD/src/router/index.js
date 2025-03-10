import Vue from 'vue';
import VueRouter from 'vue-router'; // 修改为 VueRouter
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Diagram from '@/components/Diagram.vue';

Vue.use(VueRouter); // 修改为 VueRouter

export default new VueRouter({ // 修改为 VueRouter
  routes: [
    {
      path: '/',
      redirect: '/login', // 添加重定向到登录页面
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/diagram',
      name: 'Diagram',
      component: Diagram,
    },
  ],
});