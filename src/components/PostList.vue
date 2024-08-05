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
    }
  }
};
</script>
