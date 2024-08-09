<template>
  <div>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
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
      posts: []
    };
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
              page: 1,
              pageSize: 10,
              categoryId: this.categoryId
            }
          });
          this.posts = response.data.data.records || [];
        } catch (error) {
          console.error('Error fetching posts', error);
        }
      }
    },
    async submitPost() {
      try {
        const response = await axios.post('http://localhost:8080/api/post/userPost', {
          title: this.newPost.title,
          content: this.newPost.content,
          categoryId: this.categoryId
        });
        if (response.data.code === 200) {
          this.newPost.title = '';
          this.newPost.content = '';
          this.fetchPosts(); // 发帖成功后重新加载帖子列表
        } else {
          console.error('Failed to create post:', response.data.message);
        }
      } catch (error) {
        console.error('Error creating post', error);
      }
    }
  },
  mounted() {
    this.fetchPosts();
  }
};
</script>
