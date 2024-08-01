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
    <!-- Button to navigate to the registration page -->
    <button @click="goToRegister">Don't have an account? Register</button>
    <!-- Display message if any -->
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
        if (response.data.code === 1) { // Assuming 1 means success
          // Handle successful login, maybe redirect to another page
          console.log('Login successful', response.data.result);
          router.push('/some-success-page'); // Redirect to a success page
        } else {
          this.message = response.data.message; // Show error message from backend
        }
      } catch (error) {
        console.error('Error during login', error);
        if (error.response && error.response.data) {
          this.message = error.response.data.message || 'An error occurred during login. Please try again.';
        } else {
          this.message = 'An error occurred during login. Please try again.';
        }
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
