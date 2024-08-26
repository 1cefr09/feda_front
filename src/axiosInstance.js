import axios from 'axios';
import router from './router';

const instance = axios.create({
  baseURL: 'http://192.144.219.102:8080/api',
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 从本地存储中获取 JWT
    const token = localStorage.getItem('token');
    if (token) {
      // 将 JWT 添加到请求头中
      config.headers['token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 如果 JWT 过期或无效，重定向到登录页面
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default instance;
