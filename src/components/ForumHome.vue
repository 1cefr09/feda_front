<template>
  <div class="forum-home">
    <div class="sidebar">
      <CategoryList @category-selected="handleCategorySelected" />
    </div>
    <div class="content">
      <h2 class="posts-title">Posts</h2>
      <PostList :category-id="selectedCategory" />
    </div>
    <!-- 右下角的邮箱激活按钮 -->
    <div class="email-activation-button" @click="showEmailActivation = true">
      邮箱激活
    </div>

    <!-- 邮箱激活表单 -->
    <div v-if="showEmailActivation" class="email-activation-form">
      <h3>Email Activation</h3>
      <input v-model="email" type="email" placeholder="Enter your email" />
      <button @click="sendActivationEmail">Send Activation Email</button>
      <input v-model="activationCode" type="text" placeholder="Enter activation code" />
      <button @click="activateEmail">Activate Email</button>
    </div>
  </div>
</template>

<script>
import CategoryList from './CategoryList.vue';
import PostList from './PostList.vue'; // 引入 PostList 组件

export default {
  name: 'ForumHome',
  components: {
    CategoryList,
    PostList
  },
  data() {
    return {
      selectedCategory: null,
      showEmailActivation: false,  // 控制邮箱激活表单的显示
      email: '',
      activationCode: ''
    };
  },
  methods: {
    handleCategorySelected(categoryId) {
      this.selectedCategory = categoryId;
    },
    sendActivationEmail() {
      // 发送激活邮件的逻辑
    },
    activateEmail() {
      // 激活邮箱的逻辑
    }
  }
};
</script>

<style scoped>
.forum-home {
  display: flex;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 20%;
  padding: 10px;
  box-sizing: border-box;
}

.content {
  width: 75%;
  margin-left: 5%;
  padding: 10px;
  box-sizing: border-box;
}

.posts-title {
  margin-bottom: 15px;
  font-size: 24px;
  font-weight: bold;
}

/* 右下角的按钮样式 */
.email-activation-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

/* 邮箱激活表单样式 */
.email-activation-form {
  position: fixed;
  right: 20px;
  bottom: 70px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
