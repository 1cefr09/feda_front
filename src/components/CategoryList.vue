<template>
  <div>
    <ul>
      <li v-for="category in categories" :key="category.id" @click="selectCategory(category.id)">
        {{ category.categoryName }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CategoryList',
  data() {
    return {
      categories: []
    };
  },
  async created() {
    await this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:8080/api/category/categoryList');
        this.categories = response.data.data || [];
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    },
    selectCategory(categoryId) {
      this.$emit('category-selected', categoryId);
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 10px;
  cursor: pointer; /* 显示手型光标 */
  border-bottom: 1px solid #ccc; /* 可选的分隔线 */
}
li:hover {
  background-color: #f0f0f0; /* 鼠标悬停时的背景颜色 */
}
</style>
