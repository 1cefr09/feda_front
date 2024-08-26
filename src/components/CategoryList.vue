<template>
  <div class="category-container">
    <ul class="category-list">
      <li
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
          class="category-item"
      >
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
        const response = await axios.get('http://192.144.219.102:8080/api/category/categoryList');
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
.category-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: 0 auto;
}

.category-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.category-item {
  background-color: #ffffff;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
}

.category-item:hover {
  background-color: #e9f5fc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.category-item:active {
  background-color: #d1ebf9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

</style>
