// src/router/index.js

import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

Vue.use(Router);

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/', redirect: '/login' } // 默认重定向到登录页
];

const router = new Router({
  mode: 'history',
  routes
});

export default router;
