<template>
  <div>
    <ul>
      <li v-for="post in posts" :key="post.id" class="post-item" @click="goToPost(post.id)">
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
    <div v-if="categoryId" class="post-form">
      <h3 class="form-title">Create a Post</h3>
      <input v-model="newPost.title" placeholder="Title" class="form-input title-input" />
      <textarea v-model="newPost.content" placeholder="Content" class="form-input content-input"></textarea>
      <button @click="createPost" class="post-btn">Post</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PostList',
  props: {
    categoryId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      posts: [],
      currentPage: 1,
      pageSize: 10,
      totalPosts: 0,
      newPost: {
        title: '',
        content: ''
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalPosts / this.pageSize);
    }
  },
  watch: {
    categoryId: 'fetchPosts'
  },
  methods: {
    async fetchPosts() {
      if (this.categoryId) {
        try {
          const response = await axios.get('http://localhost:8080/api/post/postPage', {
            params: {
              page: this.currentPage,
              pageSize: this.pageSize,
              categoryId: this.categoryId
            }
          });
          this.posts = response.data.data.records || [];
          this.totalPosts = response.data.data.total || 0;
        } catch (error) {
          console.error('Error fetching posts', error);
        }
      }
    },
    async createPost() {
      if (this.newPost.title && this.newPost.content) {
        try {
          const response = await axios.post('http://localhost:8080/api/post/userPost', {
            title: this.newPost.title,
            content: this.newPost.content,
            categoryId: this.categoryId
          });

          if (response.data.code === 1) { // 成功发帖的状态码
            alert('发帖成功！');
            this.newPost.title = '';
            this.newPost.content = '';
            this.fetchPosts(); // 发帖成功后刷新帖子列表
          }
        } catch (error) {
          if (error.response && error.response.status === 403) {
            alert('Your account is banned. You cannot create posts.');
          } else if (error.response && error.response.status === 500){
            alert('标题或者帖子内容不可为空！');
          }else {
            console.error('Failed to create post:', error);
          }
        }
      }
    },
    goToPost(postId) {
      this.$router.push({ name: 'CommentList', params: { postId: postId } });
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
  },
  mounted() {
    this.fetchPosts();
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center; /* 将分页按钮居中 */
  align-items: center;
  margin-top: 20px;
}

.pagination-btn {
  padding: 8px 15px;
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

ul {
  padding-left: 0; /* 移除默认的 padding */
  list-style: none; /* 移除默认的列表样式 */
}

.post-item {
  margin: 10px 0; /* 增加标题之间的间距 */
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.post-item:hover {
  background-color: #f1f1f1;
}

.post-form {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-title {
  font-size: 20px;
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.post-btn {
  padding: 12px 25px;
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

.post-content {
  margin-bottom: 30px; /* 增加帖子内容与评论之间的间距 */
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.comment-item {
  margin: 15px 0; /* 增加评论之间的间距 */
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.comment-item:hover {
  background-color: #f1f1f1;
}
</style>
