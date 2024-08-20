<template>
  <div class="user-info">
    <h2>User Information</h2>
    <div v-if="user">
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
      <p><strong>Banned:</strong> {{ user.banned ? 'Yes' : 'No' }}</p>
      <p v-if="user.activated !== undefined"><strong>Activated:</strong> {{ user.activated ? 'Yes' : 'No' }}</p>
    </div>

    <!-- 当获取的是自己的信息时，显示更新信息按钮 -->
    <button v-if="isSelf" @click="showUpdateForm = !showUpdateForm">
      {{ showUpdateForm ? 'Cancel' : 'Update Information' }}
    </button>

    <!-- 当获取的是其他用户的信息时，显示发送私信按钮 -->
    <button v-if="!isSelf" @click="showSendMessageForm = !showSendMessageForm">
      {{ showSendMessageForm ? 'Cancel' : 'Send Message' }}
    </button>

    <!-- 更新信息表单 -->
    <div v-if="showUpdateForm && isSelf">
      <h3>Update User Information</h3>
      <form @submit.prevent="updateUserInfo">
        <label>
          Username:
          <input v-model="updatedUser.username" type="text" required />
        </label>
        <label>
          Email:
          <input v-model="updatedUser.email" type="email" required />
        </label>
        <label>
          Password:
          <input v-model="updatedUser.password" type="password" required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>

    <!-- 发送私信表单 -->
    <div v-if="showSendMessageForm && !isSelf">
      <h3>Send Message</h3>
      <form @submit.prevent="sendMessage">
        <label>
          Message:
          <textarea v-model="messageContent" required></textarea>
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,
      showUpdateForm: false,
      showSendMessageForm: false,
      updatedUser: {
        username: '',
        email: '',
        password: ''
      },
      isSelf: false, // 用于区分是自己还是其他用户
      messageContent: ''
    };
  },
  created() {
    const userId = this.$route.params.userId;
    const username = this.$route.params.username;
    this.fetchUserInfo(userId, username);
  },
  methods: {
    fetchUserInfo(userId, username) {
      const apiEndpoint = userId ? '/api/user/getUserInfo' : '/api/user/getSelfInfo';
      const params = userId ? { userId, username } : {};

      axios.get(apiEndpoint, { params })
          .then(response => {
            if (response.data.code === 1) {
              this.user = response.data.data;
              this.isSelf = !userId; // 如果userId为空，则表示获取的是自己的信息
              if (this.isSelf) {
                this.updatedUser.username = this.user.username;
                this.updatedUser.email = this.user.email;
              }
            } else {
              this.$message.error('Failed to load user information.');
            }
          })
          .catch(error => {
            this.$message.error('Error occurred while fetching user information.');
            console.error(error);
          });
    },
    updateUserInfo() {
      axios.post('/api/user/updateUser', this.updatedUser)
          .then(response => {
            if (response.data.code === 1) {
              this.user = response.data.data;
              this.$message.success('User information updated successfully!');
              this.showUpdateForm = false;
            } else {
              this.$message.error('Update failed: ' + response.data.message);
            }
          })
          .catch(error => {
            this.$message.error('Error occurred while updating user information.');
            console.error(error);
          });
    },
    sendMessage() {
      const messageDTO = {
        receiverId: this.user.id,
        content: this.messageContent
      };

      axios.post('/api/message/sendMessage', messageDTO)
          .then(response => {
            if (response.data.code === 1) {
              this.$message.success('Message sent successfully!');
              this.showSendMessageForm = false;
              this.messageContent = ''; // 清空输入框
            } else {
              this.$message.error('Failed to send message: ' + response.data.message);
            }
          })
          .catch(error => {
            this.$message.error('Error occurred while sending message.');
            console.error(error);
          });
    }
  }
};
</script>

<style scoped>
.user-info {
  padding: 20px;
  font-family: Arial, sans-serif;
}

label {
  display: block;
  margin: 10px 0;
}

button {
  margin: 10px 0;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
