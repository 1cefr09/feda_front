<template>
  <div class="forum-home">
    <div class="sidebar">
      <CategoryList @category-selected="fetchPosts" />
    </div>
    <div class="content">
      <h2 class="posts-title">Posts</h2>
      <ul class="posts-list">
        <li v-for="post in posts" :key="post.id" class="post-item">
          {{ post.title }}
        </li>
      </ul>

      <!-- 分页按钮 -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
        <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
      </div>

      <!-- 发帖框 -->
      <div v-if="selectedCategory" class="post-form">
        <h3 class="form-title">Create a Post</h3>
        <input v-model="newPost.title" placeholder="Title" class="form-input title-input" />
        <textarea v-model="newPost.content" placeholder="Content" class="form-input content-input"></textarea>
        <button @click="createPost" class="post-btn">Post</button>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryList from './CategoryList.vue';
import axios from 'axios';

export default {
  name: 'ForumHome',
  components: {
    CategoryList
  },
  data() {
    return {
      posts: [],
      selectedCategory: null,
      newPost: {
        title: '',
        content: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalPosts: 0
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalPosts / this.pageSize);
    }
  },
  methods: {
    async fetchPosts(categoryId = this.selectedCategory, page = this.currentPage) {
      if (!categoryId) return;
      this.selectedCategory = categoryId;
      try {
        const response = await axios.get('http://localhost:8080/api/post/postPage', {
          params: {
            page: page,
            pageSize: this.pageSize,
            categoryId: categoryId
          }
        });
        this.posts = response.data.data.records || [];
        this.totalPosts = response.data.data.total || 0;
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    },
    async createPost() {
      if (this.newPost.title && this.newPost.content) {
        try {
          const response = await axios.post('http://localhost:8080/api/post/userPost', {
            title: this.newPost.title,
            content: this.newPost.content,
            categoryId: this.selectedCategory
          });

          if (response.data.code === 1) { // 检查响应状态码
            this.newPost.title = '';
            this.newPost.content = '';
            this.fetchPosts(); // 成功发帖后刷新帖子列表
          }else if (response.data.code === 403 ) { // 账户被禁用
            alert('Your account is banned. You cannot create posts.');
          }
        } catch (error) {
          if (error.response && error.response.status === 403) {
            alert('Your account is banned. You cannot create posts.');
          } else {
            console.error('Failed to create post:', error);
          }
        }
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchPosts();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchPosts();
      }
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

.posts-list {
  list-style-type: none;
  padding: 0;
}

.post-item {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.pagination {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.pagination-btn {
  padding: 5px 10px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
}

.post-form {
  margin-top: 25px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.form-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.title-input {
  margin-bottom: 10px;
}

.post-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  width: 100%;
}

.post-btn:hover {
  background-color: #218838;
}
</style>
