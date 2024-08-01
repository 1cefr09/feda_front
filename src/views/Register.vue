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
    <!-- Button to navigate to the login page -->
    <button @click="goToLogin">Already have an account? Login</button>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router'; // Assuming you have a router setup

//默认注册传回的参数
export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      password: '',
      passwordRepeat: '',
      email: ''
    };
  },
  methods: {
    //验证两次密码是否相同
    async register() {
      if (this.password !== this.passwordRepeat) {
        alert("两次密码不相同!");
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/api/user/register', {
          username: this.username,
          password: this.password,
          email: this.email
        });
        console.log('Register successful', response);


      } catch (error) {
        console.error('Register error', error);
        if (error.response && error.response.data) {
          this.message = error.response.data.message || 'An error occurred during registration. Please try again.';
        } else {
          this.message = 'An error occurred during registration. Please try again.';
        }
      }
    },
    // Method to navigate to the login page
    goToLogin() {
      router.push('/login');
    }
  }
};
</script>
