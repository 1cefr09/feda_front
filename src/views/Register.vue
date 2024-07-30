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
        <button type="submit">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserRegister',
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async register() {
        try {
          const response = await this.$axios.post('/api/user/register', {
            username: this.username,
            password: this.password
          });
          console.log('Registration successful', response);
        } catch (error) {
          console.error('Error during registration', error);
        }
      }
    }
  };
  </script>
  