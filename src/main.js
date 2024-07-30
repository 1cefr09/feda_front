// src/main.js

import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router // 将 router 实例注入到 Vue 实例
}).$mount('#app');
