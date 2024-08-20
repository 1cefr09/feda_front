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
  padding: 30px; /* 增加内边距 */
  font-family: 'Roboto', sans-serif; /* 使用现代字体 */
  background-color: #f8f9fa; /* 设置整体背景颜色 */
  border-radius: 8px; /* 增加圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 增加阴影效果 */
  max-width: 600px; /* 设置最大宽度 */
  margin: 0 auto; /* 居中对齐 */
}

label {
  display: block;
  margin: 15px 0 5px; /* 调整标签的上下间距 */
  font-size: 16px; /* 增加字体大小 */
  color: #333; /* 设置字体颜色 */
  font-weight: bold; /* 加粗字体 */
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%; /* 设置输入框宽度为100% */
  padding: 12px 15px; /* 增加输入框内边距 */
  margin-bottom: 20px; /* 增加输入框与下方元素的间距 */
  border: 1px solid #ccc; /* 设置边框颜色 */
  border-radius: 5px; /* 增加圆角 */
  box-sizing: border-box; /* 确保内边距和边框不会影响总宽度 */
  font-size: 14px; /* 设置字体大小 */
  transition: border-color 0.3s ease; /* 增加边框颜色渐变效果 */
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #007bff; /* 聚焦时的边框颜色 */
  outline: none; /* 移除默认的聚焦样式 */
}

button {
  display: inline-block;
  width: 100%; /* 设置按钮宽度为100% */
  padding: 12px 20px; /* 增加按钮内边距 */
  margin: 15px 0; /* 调整按钮的上下间距 */
  background-color: #28a745; /* 使用绿色按钮 */
  color: white;
  border: none;
  border-radius: 5px; /* 增加圆角 */
  font-size: 16px; /* 增加字体大小 */
  font-weight: bold; /* 加粗字体 */
  cursor: pointer;
  transition: background-color 0.3s ease; /* 增加背景颜色渐变效果 */
}

button:hover {
  background-color: #218838; /* 悬停时的按钮背景色 */
}

.button-secondary {
  background-color: #007bff; /* 添加辅助按钮样式 */
}

.button-secondary:hover {
  background-color: #0056b3; /* 悬停时的辅助按钮背景色 */
}

@media (max-width: 768px) {
  .user-info {
    padding: 20px; /* 移动设备上缩小内边距 */
  }

  label {
    font-size: 14px; /* 移动设备上调整字体大小 */
  }

  button {
    padding: 10px 15px; /* 移动设备上调整按钮内边距 */
  }
}
</style>

