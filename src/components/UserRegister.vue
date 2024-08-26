<template>
  <div class="container">
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
    <button class="login-btn" @click="goToLogin">Already have an account? Login</button>
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
        const response = await axios.post('http://192.144.219.102:8080/api/user/register', {
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f7f7f7;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

form {
  width: 100%;
  max-width: 400px;
  padding: 25px;
  background: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 20px;
}

label {
  font-size: 14px;
  margin-bottom: 8px;
  color: #555;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 14px;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  margin-top: 15px;
  text-align: center;
}

.login-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.login-btn:hover {
  background-color: #007bff;
  color: white;
}
</style>
