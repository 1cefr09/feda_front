<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required>
      </div>
      <div>
        <label for="passwordRepeat">Confirm Password:</label>
        <input type="password" v-model="passwordRepeat" id="passwordRepeat" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required>
      </div>
      <button type="submit">Register</button>
    </form>
    <div v-if="message" class="error-message">{{ message }}</div>
    <button @click="goToLogin">Already have an account? Login</button>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';

export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      password: '',
      passwordRepeat: '',
      email: '',
      message: ''
    };
  },
  methods: {
    async register() {
      if (this.password !== this.passwordRepeat) {
        this.message = "两次密码不相同!";
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/api/user/register', {
          id: this.username,
          password: this.password,
          email: this.email
        });
        if (response.data.code === 1) {
          this.message = '注册成功！';
          router.push('/login');
        } else {
          this.message = response.data.message;
        }
      } catch (error) {
        console.error('Register error', error);
        this.message = error.response?.data.message || 'An error occurred during registration. Please try again.';
      }
    },
    goToLogin() {
      router.push('/login');
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
