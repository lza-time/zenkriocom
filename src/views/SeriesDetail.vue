<template>
  <div class="series-detail">
    <header class="detail-header">
      <nav>
        <router-link to="/" class="back-btn">← Back to Home</router-link>
        <h1 class="page-title">{{ seriesName }} Series</h1>
      </nav>
    </header>

    <div class="filter-bar">
      <button
          @click="filterCategory = 'all'"
          :class="{ active: filterCategory === 'all' }"
      >
        All Products
      </button>
      <button
          @click="filterCategory = 'Bathtub'"
          :class="{ active: filterCategory === 'Bathtub' }"
      >
        Bathtubs
      </button>
      <button
          @click="filterCategory = 'Basin'"
          :class="{ active: filterCategory === 'Basin' }"
      >
        Basins
      </button>
    </div>

    <div class="products-grid">
      <div
          v-for="item in filteredProducts"
          :key="item.id"
          class="product-card"
          @click="goToProduct(item.id)"
      >
        <div class="product-image">
          <img :src="productImage(item.id)" :alt="item.name" />
          <div v-if="item.badge" class="product-badge">{{ item.badge }}</div>
        </div>
        <div class="product-info">
          <div class="product-category">{{ item.category }}</div>
          <div class="product-name">{{ item.name }}</div>
          <div class="product-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <div class="empty" v-if="filteredProducts.length === 0">
      No products found
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { productData } from '@/mock/productData.js'
import auroraImage from '@/assets/aurora-bathtub.svg'
import luminaImage from '@/assets/lumina-mirror.svg'
import vesselImage from '@/assets/vessel-basin.svg'
import nexusImage from '@/assets/nexus-toilet.svg'
import rainfallImage from '@/assets/rainfall-shower.svg'
import modularImage from '@/assets/modular-cabinet.svg'

const route = useRoute()
const router = useRouter()
const seriesName = ref(route.params.series)
const filterCategory = ref('all')
const productImages = [auroraImage, luminaImage, vesselImage, nexusImage, rainfallImage, modularImage]
const productImage = id => productImages[id - 1] || auroraImage

const filteredProducts = computed(() => {
  if (filterCategory.value === 'all') return productData
  return productData.filter(item =>
      item.category.toLowerCase().includes(filterCategory.value.toLowerCase())
  )
})

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}
</script>

<style scoped>
.series-detail {
  padding: 120px 40px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 20px rgba(0,0,0,0.08);
  z-index: 99;
  padding: 20px 0;
}

.detail-header nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  color: var(--primary);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
}

.page-title {
  font-size: 20px;
  color: var(--primary);
  margin: 0;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-bar button {
  padding: 10px 24px;
  border: 1px solid #eee;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.filter-bar button.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.product-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.4s;
  cursor: pointer;
  opacity: 1;
  transform: translateY(0);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}

.product-image {
  height: 280px;
  background: #e8e6e3;
  position: relative;
}
.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--primary);
  color: var(--accent);
  padding: 6px 14px;
  font-size: 10px;
  text-transform: uppercase;
}

.product-info {
  padding: 28px;
  text-align: center;
}

.product-category {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 8px;
}

.product-name {
  font-size: 20px;
  color: var(--primary);
  margin-bottom: 10px;
}

.product-desc {
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.6;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-light);
  font-size: 16px;
}

@media (max-width: 768px) {
  .series-detail {
    padding: 100px 20px 60px;
  }
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>