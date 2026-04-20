<template>
  <div class="product-detail">
    <header class="detail-header">
      <nav>
        <router-link to="/" class="back-btn">← Back to Home</router-link>
        <router-link :to="`/series/${product.series}`" class="series-btn">View Series</router-link>
      </nav>
    </header>

    <div class="detail-container">
      <div class="detail-left">
        <div class="detail-image">
          <svg viewBox="0 0 200 200" v-html="product.icon"></svg>
        </div>
      </div>
      <div class="detail-right">
        <div class="product-category">{{ product.category }}</div>
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-desc">{{ product.desc }}</p>

        <div class="spec-section">
          <h3>Specifications</h3>
          <div class="spec-grid">
            <div v-for="(spec, idx) in product.specs" :key="idx" class="spec-item">
              <strong>{{ spec.label }}</strong>
              <span>{{ spec.value }}</span>
            </div>
          </div>
        </div>

        <div class="feature-section">
          <h3>Core Features</h3>
          <ul>
            <li v-for="(feature, idx) in product.features" :key="idx">{{ feature }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
// 后续接数据库：替换为 axios 请求 /api/product/{id}
import { productData } from '@/mock/productData.js'

const route = useRoute()
const productId = route.params.id
const product = ref({})

// 获取产品详情（后续接接口，直接替换这里）
onMounted(() => {
  product.value = productData.find(item => item.id == productId)
})
</script>

<style scoped>
/* 风格完全统一 */
.product-detail { padding: 120px 40px 80px; max-width: 1200px; margin: 0 auto; }
.detail-header { position: fixed; top: 0; left: 0; width: 100%; background: #fff; box-shadow: 0 1px 20px rgba(0,0,0,0.08); z-index: 999; }
.detail-header nav { max-width: 1300px; margin: 0 auto; padding: 18px 40px; display: flex; align-items: center; justify-content: space-between; }
.back-btn, .series-btn { color: var(--primary); text-decoration: none; font-size: 16px; font-weight: 500; }
.detail-container { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-top: 40px; }
.detail-image { width: 100%; height: 400px; background: #e8e6e1; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
.detail-image svg { width: 200px; height: 200px; opacity: 0.3; }
.product-category { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); font-weight: 600; }
.product-name { font-size: 36px; color: var(--primary); margin: 12px 0 24px; }
.product-desc { font-size: 16px; color: var(--text-light); line-height: 1.7; margin-bottom: 30px; }
.spec-section, .feature-section { margin-bottom: 30px; }
.spec-section h3, .feature-section h3 { font-size: 18px; color: var(--primary); margin-bottom: 16px; }
.spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.spec-item { padding: 12px; background: #f7f6f3; border-radius: 4px; }
.spec-item strong { display: block; color: var(--primary); margin-bottom: 4px; }
.feature-section ul { list-style: none; padding: 0; }
.feature-section li { padding: 8px 0; color: var(--text-light); position: relative; padding-left: 20px; }
.feature-section li::before { content: '◆'; color: var(--accent); position: absolute; left: 0; top: 10px; font-size: 8px; }
@media (max-width: 768px) {
  .product-detail { padding: 100px 20px 60px; }
  .detail-container { grid-template-columns: 1fr; }
  .spec-grid { grid-template-columns: 1fr; }
}
</style>