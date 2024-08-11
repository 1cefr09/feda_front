<template>
  <div>
    <ul>
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <!-- 评论头部，显示用户名和时间 -->
        <div class="comment-header">
          <span class="comment-author">{{ comment.authorName }}</span>
          <span class="comment-time">{{ formatTime(comment.createTime)}}</span>
        </div>
        <!-- 评论内容 -->
        <div class="comment-content">
          {{ comment.content }}
        </div>

      </li>
    </ul>


    <!-- 分页按钮 -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">Previous</button>
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Next</button>
    </div>

    <!-- 发评论框 -->
    <div v-if="postId" class="comment-form">
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
      }
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
          } else if (error.response && error.response.status === 500){
            alert('评论内容不可为空！');
          }else {
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
    }
  },
  mounted() {
    this.fetchComments();
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
  padding: 8px 15px; /* 增加按钮的大小 */
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

.comment-form {
  margin-top: 30px; /* 增加评论框与上方内容的间距 */
  padding: 20px; /* 增加评论框的内边距 */
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-title {
  font-size: 20px; /* 增加标题的字体大小 */
  margin-bottom: 15px; /* 增加标题与输入框的间距 */
}

.form-input {
  width: 100%;
  padding: 12px; /* 增加输入框的内边距 */
  margin-bottom: 15px; /* 增加输入框之间的间距 */
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.comment-btn {
  padding: 12px 25px; /* 增加按钮的大小 */
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  width: 100%;
}

.comment-btn:hover {
  background-color: #218838;
}

.comment-item {
  margin: 15px 0; /* 增加评论项之间的间距 */
  padding: 15px; /* 增加评论项的内边距 */
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.comment-item:hover {
  background-color: #f1f1f1; /* 评论项悬停时的背景色变化 */
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; /* 使标题与内容间隔更大 */
}

.comment-author {
  font-weight: bold; /* 用户名加粗 */
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #888; /* 时间字体颜色稍浅 */
}

.comment-content {
  font-size: 16px;
  line-height: 1.5;
}

</style>
