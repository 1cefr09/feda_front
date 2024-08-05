<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
    <button @click="goToRegister">Don't have an account? Register</button>
    <div v-if="message" class="error-message">{{ message }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';

export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
      message: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/api/user/login', {
          username: this.username,
          password: this.password
        });
        if (response.data.code === 1) {
          const { token } = response.data.data; // 解构 data 内的 token
          localStorage.setItem('token', token); // 保存 JWT 到本地存储
          router.push('/home'); // 跳转到主页
        } else {
          this.message = response.data.message || 'Login failed. Please try again.'; // 显示错误信息
        }
      } catch (error) {
        console.error('Error during login', error);
        this.message = error.response?.data?.message || 'An error occurred during login. Please try again.';
      }
    },
    goToRegister() {
      router.push('/register');
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
