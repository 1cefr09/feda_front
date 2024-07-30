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
      <div v-if="message">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
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
          if (response.data.code === 200) {
            // Handle successful login, maybe redirect to another page
            console.log('Login successful', response.data.result);
          } else {
            this.message = response.data.message;
          }
        } catch (error) {
          console.error('Error during login', error);
          this.message = 'An error occurred during login. Please try again.';
        }
      }
    }
  };
  </script>