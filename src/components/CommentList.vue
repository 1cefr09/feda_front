<template>
  <div class="comment-list">
    <!-- 帖子标题 -->
    <h1>{{ post.title }}</h1>

    <!-- 主楼内容 -->
    <div class="post-content">
      <p>{{ post.content }}</p>
      <div class="post-meta">
        <span class="username">{{ post.username }}</span>
        <span class="timestamp">{{ post.createdAt }}</span>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comments">
      <h2>Comments</h2>
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <p>{{ comment.content }}</p>
        <div class="comment-meta">
          <span class="username">{{ comment.username }}</span>
          <span class="timestamp">{{ comment.createdAt }}</span>
        </div>
      </div>
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
      post: {},
      comments: []
    };
  },
  methods: {
    async fetchPost() {
      try {
        const response = await axios.get(`http://localhost:8080/api/post/${this.postId}`);
        this.post = response.data.data;
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    },
    async fetchComments() {
      try {
        const response = await axios.get(`http://localhost:8080/api/comment/list`, {
          params: {
            postId: this.postId
          }
        });
        this.comments = response.data.data || [];
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  },
  mounted() {
    this.fetchPost();
    this.fetchComments();
  }
};
</script>

<style scoped>
.comment-list {
  padding: 20px;
}

.post-content {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.post-meta, .comment-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
}

.comments {
  margin-top: 30px;
}

.comment-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
