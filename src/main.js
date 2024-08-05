import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

Vue.config.productionTip = false;

// Axios global configuration
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
