<template>
  <div class="forum-home">
    <div class="sidebar">
      <CategoryList @category-selected="handleCategorySelected" />
    </div>
    <div class="content">
      <h2 class="posts-title">Posts</h2>
      <PostList :category-id="selectedCategory" />
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
      selectedCategory: null
    };
  },
  methods: {
    handleCategorySelected(categoryId) {
      this.selectedCategory = categoryId;
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
</style>
