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

    <!-- 圆形加号按钮 -->
    <div class="add-post-btn" @click="togglePostForm">
      <span>+</span>
    </div>

    <!-- 发帖框 -->
    <div v-if="showPostForm" class="post-form">
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
      },
      showPostForm: false // 控制发帖框的显示和隐藏
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
          const response = await axios.get('http://192.144.219.102:8080/api/post/postPage', {
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
          const response = await axios.post('http://192.144.219.102:8080/api/post/userPost', {
            title: this.newPost.title,
            content: this.newPost.content,
            categoryId: this.categoryId
          });

          if (response.data.code === 1) { // 成功发帖的状态码
            alert('发帖成功！');
            this.newPost.title = '';
            this.newPost.content = '';
            this.fetchPosts(); // 发帖成功后刷新帖子列表
            this.showPostForm = false; // 发帖成功后隐藏发帖框
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
    },
    togglePostForm() {
      this.showPostForm = !this.showPostForm; // 切换发帖框显示状态
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
  justify-content: center;
  align-items: center;
  margin-top: 25px; /* 增加分页按钮上方的间距 */
}

.pagination-btn {
  padding: 10px 20px; /* 增大按钮的内边距 */
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px; /* 增大按钮的圆角 */
  cursor: pointer;
  transition: background-color 0.3s ease; /* 添加渐变效果 */
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 16px; /* 调整分页信息的字体大小 */
}

ul {
  padding-left: 0;
  list-style: none;
}

.post-item {
  margin: 15px 0; /* 增大标题之间的间距 */
  padding: 15px 20px; /* 增大内边距 */
  border: 1px solid #ddd;
  border-radius: 6px; /* 增大圆角 */
  background-color: #ffffff; /* 改为纯白背景 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加轻微阴影效果 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加渐变效果 */
  cursor: pointer;
}

.post-item:hover {
  background-color: #f8f8f8; /* 改进悬停效果的颜色 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 增强悬停效果的阴影 */
}

.post-form {
  margin-top: 40px; /* 增加发帖表单上方的间距 */
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 8px; /* 增大圆角 */
  background-color: #ffffff; /* 添加白色背景 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加轻微阴影效果 */
}
.add-post-btn {
  position: fixed;
  bottom: 40px;
  left: 40px;
  width: 60px;
  height: 60px;
  background-color: #28a745;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 36px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.add-post-btn:hover {
  background-color: #218838;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.post-form {
  position: fixed;
  bottom: 100px;
  left: 20px;
  right: 20px;
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 确保发帖框在最上层 */
}

.form-title {
  font-size: 22px; /* 增大标题字体 */
  margin-bottom: 20px; /* 增大标题与输入框之间的间距 */
  font-weight: bold; /* 加粗标题 */
  color: #333; /* 改变标题颜色 */
}

.form-input {
  width: 100%;
  padding: 15px; /* 增大输入框的内边距 */
  margin-bottom: 20px; /* 增大输入框之间的间距 */
  box-sizing: border-box;
  border: 1px solid #ccc; /* 调整边框颜色 */
  border-radius: 6px; /* 增大圆角 */
  transition: border-color 0.3s ease; /* 添加渐变效果 */
}

.form-input:focus {
  border-color: #007bff; /* 聚焦时改变边框颜色 */
  outline: none;
}

.post-btn {
  padding: 15px 25px; /* 增大按钮内边距 */
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px; /* 增大按钮圆角 */
  cursor: pointer;
  display: block;
  width: 100%;
  font-size: 16px; /* 调整按钮字体大小 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加渐变效果 */
}

.post-btn:hover {
  background-color: #218838;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 添加悬停阴影效果 */
}

.post-content {
  margin-bottom: 35px; /* 增加帖子内容与评论之间的间距 */
  padding: 25px;
  border-bottom: 1px solid #ddd;
  background-color: #f8f8f8; /* 添加背景色 */
  border-radius: 6px; /* 增大圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加轻微阴影效果 */
}

.comment-item {
  margin: 20px 0; /* 增大评论之间的间距 */
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px; /* 增大圆角 */
  background-color: #ffffff; /* 改为纯白背景 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加轻微阴影效果 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* 添加渐变效果 */
}

.comment-item:hover {
  background-color: #f1f1f1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 增强悬停效果的阴影 */
}
</style>

