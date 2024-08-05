<template>
  <div>
    <div class="sidebar">
      <CategoryList @category-selected="fetchPosts" />
    </div>
    <div class="content">
      <h2>Posts</h2>
      <ul>
        <li v-for="post in posts" :key="post.id">
          {{ post.title }}
        </li>
      </ul>
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
      selectedCategory: null
    };
  },
  methods: {
    async fetchPosts(categoryId) {
      this.selectedCategory = categoryId;
      try {
        const response = await axios.get('http://localhost:8080/api/post/postPage', {
          params: {
            page: 1,
            pageSize: 10,
            categoryId: categoryId
          }
        });
        this.posts = response.data.data.records || [];
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    }
  }
};
</script>

<style scoped>
.sidebar {
  float: left;
  width: 20%;
}
.content {
  float: left;
  width: 80%;
}
</style>
