<template>
  <div class="forum-home">
    <div class="sidebar">
      <CategoryList @category-selected="handleCategorySelected" />
    </div>
    <div class="content">
      <h2 class="posts-title">Posts</h2>
      <PostList :category-id="selectedCategory" />

      <div v-if="!activationSent">
        <button class="activate-button" @click="sendActivationEmail">Activate Email</button>
      </div>

      <div v-else>
        <input type="text" v-model="activationCode" placeholder="Enter activation code"/>
        <button class="activate-button" @click="activateEmail">Verify Code</button>
      </div>

      <div class="user-info-button">
        <button @click="goToUserInfo">个人用户中心</button>
      </div>

      <p v-if="message" class="response-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import CategoryList from './CategoryList.vue';
import PostList from './PostList.vue';
import axios from 'axios';

export default {
  name: 'ForumHome',
  components: {
    CategoryList,
    PostList
  },
  data() {
    return {
      selectedCategory: null,
      activationSent: false,
      activationCode: '',
      message: ''
    };
  },
  methods: {
    handleCategorySelected(categoryId) {
      this.selectedCategory = categoryId;
    },
    sendActivationEmail() {
      axios.get('/api/user/sendActivate')
          .then(response => {
            if (response.data.code === 1) {
              this.activationSent = true;
              this.message = 'Activation email sent successfully!';
            } else {
              this.message = response.data.message || 'Activation failed.';
            }
          })
          .catch(error => {
            this.message = 'Failed to send activation email.';
            console.error(error);
          });
    },
    activateEmail() {
      axios.get('/api/user/activate', {
        params: {
          code: this.activationCode
        }
      })
          .then(response => {
            if (response.data.code === 1) {
              this.message = 'Email activated successfully!';
            } else {
              this.message = response.data.message || 'Invalid activation code.';
            }
          })
          .catch(error => {
            this.message = 'Error occurred during activation.';
            console.error(error);
          });
    },
    goToUserInfo() {
      this.$router.push('/userInfo');
    }
  }
};
</script>

<style scoped>
.forum-home {
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9; /* 添加背景色 */
  color: #333; /* 调整文字颜色 */
}

.sidebar {
  width: 18%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff; /* 添加侧边栏背景色 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  border-radius: 8px; /* 添加圆角 */
}

.content {
  width: 77%;
  margin-left: 3%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff; /* 添加内容背景色 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  border-radius: 8px; /* 添加圆角 */
}

.posts-title {
  margin-bottom: 20px;
  font-size: 28px; /* 增大标题字体 */
  font-weight: bold;
  color: #007bff; /* 改变标题颜色 */
}

.activate-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #28a745; /* 改变按钮颜色 */
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px; /* 加大按钮圆角 */
  cursor: pointer;
  font-size: 16px; /* 增大按钮字体 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15); /* 添加阴影 */
}

.activate-button:hover {
  background-color: #218838; /* 改变悬停颜色 */
}

.response-message {
  margin-top: 15px;
  font-size: 16px; /* 增大提示信息字体 */
  font-weight: 600;
}

.response-message.error {
  color: #dc3545; /* 改变错误提示颜色 */
}

.user-info-button {
  position: fixed;
  top: 30px;
  right: 30px;
}

.user-info-button button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px; /* 加大按钮圆角 */
  cursor: pointer;
  font-size: 16px; /* 调整字体大小 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15); /* 添加阴影 */
}

.user-info-button button:hover {
  background-color: #0056b3;
}
</style>

