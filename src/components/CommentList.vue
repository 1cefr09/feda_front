<template>
  <div class="comment-section">
    <ul>
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <!-- 评论头部，显示用户名和时间 -->
        <div class="comment-header">
          <span class="comment-author" @click="goToUserInfo(comment.authorId, comment.authorName)" style="cursor: pointer; color: blue;">
            {{ comment.authorName }}
          </span>
          <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
        </div>
        <!-- 评论内容 -->
        <div class="comment-content">
          {{ comment.content }}
        </div>
        <!-- 评论楼层 -->
        <div class="comment-footer">
          <span class="comment-floor">#{{ comment.floor }} 楼</span>
        </div>
      </li>
    </ul>

    <!-- 分页按钮 -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
    </div>

    <!-- 回帖按钮 -->
    <div class="comment-add-btn" @click="toggleCommentForm">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
    </div>

    <!-- 发评论框 -->
    <div v-if="showCommentForm" class="comment-form">
      <h3 class="form-title">Add a Comment</h3>
      <textarea v-model="newComment.content" placeholder="Comment" class="form-input content-input"></textarea>
      <button @click="createComment" class="comment-btn">Comment</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CommentList',
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      currentPage: 1,
      pageSize: 10,
      totalComments: 0,
      newComment: {
        content: ''
      },
      showCommentForm: false
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalComments / this.pageSize);
    }
  },
  watch: {
    postId: 'fetchComments'
  },
  methods: {
    async fetchComments() {
      if (this.postId) {
        try {
          const response = await axios.get('http://localhost:8080/api/comment/commentPage', {
            params: {
              page: this.currentPage,
              pageSize: this.pageSize,
              postId: this.postId
            }
          });
          this.comments = response.data.data.records || [];
          this.totalComments = response.data.data.total || 0;
        } catch (error) {
          console.error('Error fetching comments', error);
        }
      }
    },
    async createComment() {
      if (this.newComment.content) {
        try {
          const response = await axios.post('http://localhost:8080/api/comment/userComment', {
            content: this.newComment.content,
            postId: this.postId
          });

          if (response.data.code === 1) { // 成功评论的状态码
            alert('评论成功！');
            this.newComment.content = '';
            this.fetchComments(); // 评论成功后刷新评论列表
          }
        } catch (error) {
          if (error.response && error.response.status === 403) {
            alert('Your account is banned. You cannot comment.');
          } else if (error.response && error.response.status === 500) {
            alert('评论内容不可为空！');
          } else {
            console.error('Failed to create comment:', error);
          }
        }
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchComments();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchComments();
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString(); // 将时间格式化为本地格式
    },
    async goToUserInfo(userId, username) {
      try {
        const response = await axios.get('http://localhost:8080/api/user/getUserInfo', {
          params: {
            userId: userId,
            username: username
          }
        });

        if (response.data.code === 1) {
          const userInfo = response.data.data;
          // 这里可以将获取到的用户信息展示在一个新的页面或弹窗中
          console.log('User Info:', userInfo);
          // 跳转到用户信息页面（假设你已经设置了相关路由）
          this.$router.push({ name: 'UserInfo', params: { userId: userInfo.id } });
        } else {
          alert('无法获取用户信息');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },
    toggleCommentForm() {
      this.showCommentForm = !this.showCommentForm;
    }
  },
  mounted() {
    this.fetchComments();
  }
};
</script>

<style scoped>
.comment-section {
  position: relative;
  padding-bottom: 60px; /* 预留空间放置回帖按钮 */
}

.comment-add-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.comment-add-btn:hover {
  background-color: #0056b3;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-btn {
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-btn:hover {
  background-color: #0056b3;
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
}

.comment-form {
  margin-top: 30px;
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fdfdfd;
}

.form-title {
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.comment-btn {
  padding: 15px 30px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.comment-btn:hover {
  background-color: #218838;
}

.comment-item {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.comment-item:hover {
  background-color: #f1f1f1;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.comment-author {
  font-weight: bold;
  font-size: 16px;
}

.comment-time {
  font-size: 14px;
  color: #777;
}

.comment-content {
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.5;
}

.comment-footer {
  text-align: right;
}

.comment-floor {
  font-size: 14px;
  color: #555;
}
</style>
