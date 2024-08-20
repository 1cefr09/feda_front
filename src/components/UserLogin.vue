<template>
  <div class="login-container">
    <div class="header">
      <h1 class="forum-title">FEDA</h1>
    </div>
    <div class="login-box">
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
      <button @click="goToRegister" class="register-btn">Don't have an account? Register</button>
      <div v-if="message" class="error-message">{{ message }}</div>
    </div>
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
          const { token } = response.data.data;
          localStorage.setItem('token', token);
          router.push('/home');
        } else {
          this.message = response.data.message || 'Login failed. Please try again.';
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
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

form {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.register-btn {
  margin-top: 15px;
  padding: 10px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.register-btn:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
.header {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.forum-title {
  font-family: 'Georgia', serif; /* 选择合适的字体 */
  font-size: 3em; /* 字体大小 */
  color: #2c3e50; /* 字体颜色 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
}

</style>
