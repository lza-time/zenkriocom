<template>
  <!-- 预加载 -->
  <div class="preloader" :class="{ hidden: preloaderHidden }">
    <div class="progress-ring">
      <svg width="120" height="120">
        <circle class="progress-ring__circle-bg" r="52" cx="60" cy="60"/>
        <circle class="progress-ring__circle" r="52" cx="60" cy="60" :stroke-dashoffset="progressOffset"/>
      </svg>
      <div class="progress-text">{{ progress }}%</div>
    </div>
  </div>

  <div id="app">
    <!-- Header Navigation -->
    <header id="header">
      <nav>
        <!-- Logo跳首页 -->
        <router-link to="/" class="logo">ZENT<span>RIO</span></router-link>
        <ul class="nav-links">
          <li><a href="#products" class="nav-link">Product Series</a></li>
          <li><a href="#categories" class="nav-link">Product Categories</a></li>
          <li><a href="#advantages" class="nav-link">Core Advantages</a></li>
          <li>
            <router-link to="/contact" class="btn-contact">Business Cooperation</router-link>
          </li>
        </ul>
        <button class="hamburger" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu">
      <button class="mobile-close" @click="toggleMobileMenu">✕</button>
      <a href="#products" @click="toggleMobileMenu">Product Series</a>
      <a href="#categories" @click="toggleMobileMenu">Product Categories</a>
      <a href="#advantages" @click="toggleMobileMenu">Core Advantages</a>
      <router-link to="/contact" @click="toggleMobileMenu">Business Cooperation</router-link>
    </div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-geo"></div>
      <div class="hero-content">
        <div class="hero-label">Premium Bathroom Solutions</div>
        <h1>Redefining the Future Aesthetics of <strong>Bathroom Spaces</strong></h1>
        <p>ZENTRIO is dedicated to providing high-end customized bathroom solutions for global hotels, real estate and commercial projects, reshaping the experience with exquisite craftsmanship and forward-looking design.</p>
        <div class="hero-actions">
          <a href="#products" class="btn-primary">Explore Products</a>
          <router-link to="/contact" class="btn-secondary">Get a Quote</router-link>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stats-container">
        <div class="stat-item fade-up">
          <div class="stat-number">18+</div>
          <div class="stat-label">Years of Experience</div>
        </div>
        <div class="stat-item fade-up">
          <div class="stat-number">2,600+</div>
          <div class="stat-label">Completed Projects</div>
        </div>
        <div class="stat-item fade-up">
          <div class="stat-number">46</div>
          <div class="stat-label">Export Countries</div>
        </div>
        <div class="stat-item fade-up">
          <div class="stat-number">360+</div>
          <div class="stat-label">Product SKUs</div>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <section class="products" id="products">
      <div class="section-header fade-up">
        <div class="section-label">Product Collection</div>
        <h2 class="section-title">Craftsmanship & <strong>Curated Collections</strong></h2>
        <p class="section-desc">Every ZENTRIO product is crafted with rigorous standards, integrating minimalism aesthetics with exceptional performance.</p>
      </div>
      <div class="products-grid">
        <!-- 产品卡片：点击跳产品详情 -->
        <div class="product-card fade-up" @click="goToProduct(1)">
          <div class="product-image">
            <svg viewBox="0 0 200 200">
              <ellipse cx="100" cy="130" rx="80" ry="30" stroke="#999" stroke-width="1.5" fill="none"/>
              <path d="M20 130 Q20 50 100 40 Q180 50 180 130" stroke="#999" stroke-width="1.5" fill="none"/>
              <line x1="100" y1="40" x2="100" y2="15" stroke="#999" stroke-width="1.5"/>
              <circle cx="100" cy="12" r="4" stroke="#999" stroke-width="1.5" fill="none"/>
            </svg>
            <div class="product-badge">Hot Sale</div>
          </div>
          <div class="product-info">
            <div class="product-category">Freestanding Bathtub</div>
            <div class="product-name">AURORA Series</div>
            <div class="product-desc">Solid surface integrated molding, streamline design, constant temperature insulation technology</div>
            <div class="product-specs">
              <div class="spec"><strong>1700mm</strong>Length</div>
              <div class="spec"><strong>Matte White</strong>Finish</div>
              <div class="spec"><strong>Solid Surface</strong>Material</div>
            </div>
          </div>
        </div>

        <div class="product-card fade-up" @click="goToProduct(2)">
          <div class="product-image">
            <svg viewBox="0 0 200 200">
              <rect x="40" y="50" width="120" height="100" rx="3" stroke="#999" stroke-width="1.5" fill="none"/>
              <rect x="55" y="65" width="90" height="70" rx="2" stroke="#999" stroke-width="1.2" fill="none"/>
              <line x1="100" y1="155" x2="100" y2="170" stroke="#999" stroke-width="1.5"/>
              <circle cx="100" cy="175" r="5" stroke="#999" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <div class="product-info">
            <div class="product-category">Smart Mirror Cabinet</div>
            <div class="product-name">LUMINA Series</div>
            <div class="product-desc">LED touch dimming, anti-fog system, hidden storage space design</div>
            <div class="product-specs">
              <div class="spec"><strong>900mm</strong>Width</div>
              <div class="spec"><strong>Touch</strong>Control</div>
              <div class="spec"><strong>IP44</strong>Protection</div>
            </div>
          </div>
        </div>

        <div class="product-card fade-up" @click="goToProduct(3)">
          <div class="product-image">
            <svg viewBox="0 0 200 200">
              <ellipse cx="100" cy="100" rx="55" ry="20" stroke="#999" stroke-width="1.5" fill="none"/>
              <path d="M45 100 Q45 160 100 165 Q155 160 155 100" stroke="#999" stroke-width="1.5" fill="none"/>
              <circle cx="100" cy="90" r="6" stroke="#999" stroke-width="1.5" fill="none"/>
              <line x1="100" y1="60" x2="100" y2="84" stroke="#999" stroke-width="1.5"/>
              <line x1="88" y1="52" x2="100" y2="60" stroke="#999" stroke-width="1.2"/>
              <line x1="112" y1="52" x2="100" y2="60" stroke="#999" stroke-width="1.2"/>
            </svg>
            <div class="product-badge">New Arrival</div>
          </div>
          <div class="product-info">
            <div class="product-category">Countertop Basin</div>
            <div class="product-name">VESSEL Series</div>
            <div class="product-desc">Ultra-thin edge, nano self-cleaning glaze, antibacterial ceramic technology</div>
            <div class="product-specs">
              <div class="spec"><strong>600mm</strong>Diameter</div>
              <div class="spec"><strong>Nano Glaze</strong>Finish</div>
              <div class="spec"><strong>Ceramic</strong>Material</div>
            </div>
          </div>
        </div>

        <div class="product-card fade-up" @click="goToProduct(4)">
          <div class="product-image">
            <svg viewBox="0 0 200 200">
              <rect x="60" y="30" width="80" height="140" rx="3" stroke="#999" stroke-width="1.5" fill="none"/>
              <rect x="70" y="40" width="60" height="80" rx="2" stroke="#999" stroke-width="1.2" fill="none"/>
              <circle cx="100" cy="145" r="10" stroke="#999" stroke-width="1.5" fill="none"/>
              <circle cx="100" cy="145" r="4" fill="#999" opacity="0.3"/>
            </svg>
          </div>
          <div class="product-info">
            <div class="product-category">Smart Toilet</div>
            <div class="product-name">NEXUS Series</div>
            <div class="product-desc">Instant heating system, auto lid sensor, UV sterilization & deodorization</div>
            <div class="product-specs">
              <div class="spec"><strong>3/4.5L</strong>Water Volume</div>
              <div class="spec"><strong>Smart Sensor</strong>Control</div>
              <div class="spec"><strong>Level 1</strong>Water Efficiency</div>
            </div>
          </div>
        </div>

        <div class="product-card fade-up" @click="goToProduct(5)">
          <div class="product-image">
            <svg viewBox="0 0 200 200">
              <line x1="100" y1="30" x2="100" y2="80" stroke="#999" stroke-width="1.5"/>
              <circle cx="100" cy="90" r="12" stroke="#999" stroke-width="1.5" fill="none"/>
              <path d="M88 92 Q100 140 112 92" stroke="#999" stroke-width="1" fill="none" opacity="0.4"/>
              <line x1="94" y1="110" x2="94" y2="140" stroke="#999" stroke-width="0.8" opacity="0.3"/>
              <line x1="100" y1="115" x2="100" y2="150" stroke="#999" stroke-width="0.8" opacity="0.3"/>
              <line x1="106" y1="110" x2="106" y2="140" stroke="#999" stroke-width="0.8" opacity="0.3"/>
            </svg>
          </div>
          <div class="product-info">
            <div class="product-category">Shower System</div>
            <div class="product-name">RAINFALL Series</div>
            <div class="product-desc">Thermostatic valve technology, air-injected water, 304 stainless steel body</div>
            <div class="product-specs">
              <div class="spec"><strong>300mm</strong>Top Spray</div>
              <div class="spec"><strong>Thermostat</strong>Control</div>
              <div class="spec"><strong>Stainless Steel</strong>Material</div>
            </div>
          </div>
        </div>

        <div class="product-card fade-up" @click="goToProduct(6)">
          <div class="product-image">
            <svg viewBox="0 0 200 200">
              <rect x="30" y="60" width="140" height="80" rx="3" stroke="#999" stroke-width="1.5" fill="none"/>
              <rect x="45" y="72" width="50" height="55" rx="2" stroke="#999" stroke-width="1.2" fill="none"/>
              <rect x="105" y="72" width="50" height="55" rx="2" stroke="#999" stroke-width="1.2" fill="none"/>
              <circle cx="70" cy="55" r="6" stroke="#999" stroke-width="1.2" fill="none"/>
              <circle cx="130" cy="55" r="6" stroke="#999" stroke-width="1.2" fill="none"/>
              <line x1="30" y1="140" x2="30" y2="170" stroke="#999" stroke-width="1.5"/>
              <line x1="170" y1="140" x2="170" y2="170" stroke="#999" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="product-info">
            <div class="product-category">Bathroom Cabinet</div>
            <div class="product-name">MODULAR Series</div>
            <div class="product-desc">Modular design, moisture-proof multilayer wood, soft close hinge technology</div>
            <div class="product-specs">
              <div class="spec"><strong>1200mm</strong>Width</div>
              <div class="spec"><strong>Double Basin</strong>Configuration</div>
              <div class="spec"><strong>Solid Wood</strong>Board</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Product -->
    <div class="featured">
      <div class="featured-visual">
        <svg viewBox="0 0 200 200">
          <ellipse cx="100" cy="140" rx="85" ry="25" stroke="#c9a96e" stroke-width="1" fill="none"/>
          <path d="M15 140 Q15 50 100 35 Q185 50 185 140" stroke="#c9a96e" stroke-width="1" fill="none"/>
          <line x1="100" y1="35" x2="100" y2="10" stroke="#c9a96e" stroke-width="1"/>
          <circle cx="100" cy="7" r="4" stroke="#c9a96e" stroke-width="1" fill="none"/>
          <path d="M50 140 Q50 90 100 80 Q150 90 150 140" stroke="#c9a96e" stroke-width="0.5" fill="none" opacity="0.4"/>
        </svg>
      </div>
      <div class="featured-content fade-up">
        <div class="section-label">Signature Collection</div>
        <h2>AURORA <strong>Flagship Series</strong></h2>
        <p>The AURORA series represents ZENTRIO's ultimate interpretation of bathroom aesthetics. Featuring integrated solid surface craftsmanship and 12-step fine polishing, it delivers a silky-smooth touch.</p>
        <ul class="feature-list">
          <li>Integrated solid surface · Seamless design</li>
          <li>Double-layer insulation · 40% longer constant temperature</li>
          <li>Hidden overflow system · Minimalist profile</li>
          <li>Custom sizes available · Project-ready</li>
          <li>CE, cUPC, WaterMark certified</li>
        </ul>
        <!-- 跳系列详情 -->
        <router-link to="/series/AURORA" class="btn-primary">View Series</router-link>
      </div>
    </div>

    <!-- Product Categories -->
    <section id="categories">
      <div class="section-header fade-up">
        <div class="section-label">Product Categories</div>
        <h2 class="section-title">Full Range of <strong>Bathroom Products</strong></h2>
        <p class="section-desc">Cover all bathroom scenarios, providing one-stop solutions for engineering projects.</p>
      </div>
      <div class="categories-grid">
        <!-- 分类跳系列详情 -->
        <router-link to="/series/Bathtub" class="category-card fade-up">
          <div class="category-count">86 SKU</div>
          <svg class="category-geo" width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="80" stroke="#c9a96e" stroke-width="0.5" fill="none"/>
            <circle cx="90" cy="90" r="50" stroke="#c9a96e" stroke-width="0.5" fill="none"/>
          </svg>
          <div class="category-info">
            <h3>Bathtubs & Whirlpools</h3>
            <p>Freestanding, built-in, massage tubs in solid surface & acrylic</p>
          </div>
        </router-link>

        <router-link to="/series/Basin" class="category-card fade-up">
          <div class="category-count">124 SKU</div>
          <svg class="category-geo" width="180" height="180" viewBox="0 0 180 180">
            <rect x="20" y="20" width="140" height="140" stroke="#c9a96e" stroke-width="0.5" fill="none" transform="rotate(15, 90, 90)"/>
          </svg>
          <div class="category-info">
            <h3>Basins & Sinks</h3>
            <p>Countertop, under-mount, integrated & wall-hung basins</p>
          </div>
        </router-link>

        <router-link to="/series/Faucet" class="category-card wide fade-up">
          <div class="category-count">150+ SKU</div>
          <svg class="category-geo" width="240" height="180" viewBox="0 0 240 180">
            <polygon points="120,10 230,170 10,170" stroke="#c9a96e" stroke-width="0.5" fill="none"/>
          </svg>
          <div class="category-info">
            <h3>Faucets, Showers & Hardware</h3>
            <p>Brass & stainless steel fixtures, complete bathroom hardware system</p>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Core Advantages -->
    <section class="advantages" id="advantages">
      <div class="section-header fade-up">
        <div class="section-label">Why ZENTRIO</div>
        <h2 class="section-title">Core Advantages of <strong>Choosing ZENTRIO</strong></h2>
        <p class="section-desc">From R&D to delivery, we provide end-to-end professional support for B2B clients.</p>
      </div>
      <div class="advantages-grid">
        <div class="advantage-card fade-up">
          <div class="advantage-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h4>OEM & ODM Customization</h4>
          <p>Brand customization & in-depth development to meet market needs</p>
        </div>
        <div class="advantage-card fade-up">
          <div class="advantage-icon">
            <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <h4>International Quality Certification</h4>
          <p>Certified by CE, cUPC, WaterMark, WRAS & global standards</p>
        </div>
        <div class="advantage-card fade-up">
          <div class="advantage-icon">
            <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a1 1 0 01-1 1h-1M6 19a2 2 0 104 0M14 19a2 2 0 104 0"/></svg>
          </div>
          <h4>Global Logistics Network</h4>
          <p>Own warehouses & global partners ensure on-time delivery</p>
        </div>
        <div class="advantage-card fade-up">
          <div class="advantage-icon">
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <h4>Dedicated Project Manager</h4>
          <p>One-on-one service, full support from selection to installation</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta" id="contact">
      <h2 class="fade-up">Start Your Next <strong>Bathroom Project</strong></h2>
      <p class="fade-up">Whether hotel engineering, real estate or commercial customization, ZENTRIO's professional team delivers tailored solutions.</p>
      <div class="cta-buttons fade-up">
        <router-link to="/contact" class="btn-primary">Contact Business Team</router-link>
        <a href="#" class="btn-secondary">Download Catalog</a>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <router-link to="/" class="logo">ZENT<span>RIO</span></router-link>
          <p>ZENTRIO — Committed to becoming a leading brand of premium bathroom solutions worldwide.</p>
        </div>
        <div class="footer-col">
          <h4>Products</h4>
          <a href="#">Bathtub Series</a>
          <a href="#">Basin Series</a>
          <a href="#">Smart Toilets</a>
          <a href="#">Faucets & Showers</a>
          <a href="#">Bathroom Cabinets</a>
          <a href="#">Bathroom Hardware</a>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          <a href="#">Engineering Support</a>
          <a href="#">OEM & ODM</a>
          <a href="#">Design Consultation</a>
          <a href="#">After-Sales Support</a>
          <a href="#">Sample Request</a>
        </div>
        <div class="footer-col">
          <h4>Contact Us</h4>
          <a href="#">business@zentrio.com</a>
          <a href="#">+86 400-888-XXXX</a>
          <a href="#">Foshan, China</a>
          <a href="#">LinkedIn</a>
          <a href="#">Alibaba</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 ZENTRIO. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  </div>

  <!-- 返回顶部按钮 -->
  <!-- 返回顶部按钮（最终修复版） -->
  <button
      v-show="showBackTop"
      class="back-top-btn"
      @click="scrollToTop"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

// 跳产品详情
const goToProduct = (id) => {
  router.push(`/product/${id}`)
}

// 移动端菜单
const toggleMobileMenu = () => {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('active');
};

// 预加载
const progress = ref(0)
const preloaderHidden = ref(false)
const circumference = 2 * Math.PI * 52
const progressOffset = ref(circumference)

const startLoading = () => {
  const timer = setInterval(() => {
    progress.value += 4
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(timer)
      setTimeout(() => {
        preloaderHidden.value = true
      }, 300)
    }
    progressOffset.value = circumference - (progress.value / 100) * circumference
  }, 80)
}

// 返回顶部（关键修复）
const showBackTop = ref(false)
const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  startLoading()

  // 导航栏滚动效果
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
    showBackTop.value = window.scrollY > 300;
  });

  // 锚点平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 渐入动画
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  // 数字增长动画
  const animateStats = () => {
    document.querySelectorAll('.stat-number').forEach(el => {
      const text = el.textContent;
      const target = parseInt(text.replace(/,/g, '')) || 0;
      const suffix = text.replace(/[\d,]/g, '');
      let current = 0;
      const increment = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current.toLocaleString() + suffix;
      }, 25);
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => entry.isIntersecting && animateStats());
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statsObserver.observe(statsBar);
});
</script>

<style>
/* 你原版完整样式，100%保留，无任何改动 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
:root {
  --primary: #1a1a2e;
  --accent: #c9a96e;
  --accent-light: #e0c999;
  --text: #333;
  --text-light: #777;
  --bg: #ffffff;
  --bg-light: #f7f6f3;
  --bg-dark: #0f0f1a;
}
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text);
  background: var(--bg);
  overflow-x: hidden;
  line-height: 1.6;
}
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background 0.4s, box-shadow 0.4s;
  background: transparent;
}
header.scrolled {
  background: rgba(255,255,255,0.97);
  box-shadow: 0 1px 20px rgba(0,0,0,0.08);
}
header.scrolled .nav-link,
header.scrolled .logo {
  color: var(--primary) !important;
}
header.scrolled .btn-contact {
  border-color: var(--primary) !important;
  color: var(--primary) !important;
}
header.scrolled .btn-contact:hover {
  background: var(--primary) !important;
  color: #fff !important;
}
nav {
  max-width: 1300px;
  margin: 0 auto;
  padding: 18px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 6px;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}
.logo span {
  color: var(--accent);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 36px;
  list-style: none;
}
.nav-link {
  text-decoration: none;
  color: rgba(255,255,255,0.85);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.3s;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: var(--accent);
  transition: width 0.3s;
}
.nav-link:hover::after {
  width: 100%;
}
.btn-contact {
  padding: 10px 28px;
  border: 1.5px solid rgba(255,255,255,0.6);
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s;
  border-radius: 2px;
}
.btn-contact:hover {
  background: #fff;
  color: var(--primary);
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
}
.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  transition: background 0.3s;
}
header.scrolled .hamburger span {
  background: var(--primary);
}
.hero {
  position: relative;
  height: 100vh;
  min-height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--bg-dark);
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
}
.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
      radial-gradient(ellipse 80% 60% at 20% 80%, rgba(201,169,110,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 20%, rgba(201,169,110,0.06) 0%, transparent 50%);
}
.hero-geo {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.hero-geo::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border: 1px solid rgba(201,169,110,0.1);
  border-radius: 50%;
  top: -120px;
  right: -100px;
}
.hero-geo::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border: 1px solid rgba(201,169,110,0.08);
  bottom: -60px;
  left: -60px;
  transform: rotate(45deg);
}
.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 20px;
  max-width: 900px;
}
.hero-label {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 28px;
  font-weight: 500;
  border: 1px solid rgba(201,169,110,0.3);
  padding: 8px 24px;
}
.hero h1 {
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 300;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}
.hero h1 strong {
  font-weight: 700;
}
.hero p {
  font-size: 17px;
  color: rgba(255,255,255,0.55);
  max-width: 560px;
  margin: 0 auto 44px;
  line-height: 1.7;
  font-weight: 300;
}
.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-primary {
  padding: 16px 42px;
  background: var(--accent);
  color: var(--primary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.3s;
  border-radius: 2px;
}
.btn-primary:hover {
  background: var(--accent-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(201,169,110,0.3);
}
.btn-secondary {
  padding: 16px 42px;
  border: 1.5px solid rgba(255,255,255,0.25);
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.3s;
  border-radius: 2px;
}
.btn-secondary:hover {
  border-color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.05);
}
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.3);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(201,169,110,0.6), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
  50% { opacity: 1; transform: scaleY(1); }
}
.stats-bar {
  background: var(--primary);
  padding: 50px 40px;
}
.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  text-align: center;
}
.stat-item {
  padding: 10px;
}
.stat-number {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 8px;
}
.stat-label {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 500;
}
section {
  padding: 100px 40px;
}
.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 70px;
}
.section-label {
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 16px;
}
.section-title {
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 300;
  color: var(--primary);
  line-height: 1.25;
  margin-bottom: 18px;
}
.section-title strong {
  font-weight: 700;
}
.section-desc {
  font-size: 16px;
  color: var(--text-light);
  line-height: 1.7;
}
.products {
  background: var(--bg-light);
}
.products-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
.product-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.4s, box-shadow 0.4s;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}
.product-image {
  height: 280px;
  background: #e8e6e1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-image svg {
  width: 120px;
  height: 120px;
  opacity: 0.25;
}
.product-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--primary);
  color: var(--accent);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 6px 14px;
  font-weight: 600;
}
.product-info {
  padding: 28px;
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
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 10px;
}
.product-desc {
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 20px;
}
.product-specs {
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
.spec {
  font-size: 11px;
  color: var(--text-light);
  letter-spacing: 0.5px;
}
.spec strong {
  display: block;
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 2px;
}
.featured {
  background: var(--primary);
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;
}
.featured-visual {
  background: linear-gradient(135deg, #1e1e38 0%, #2a2a4a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}
.featured-visual::before {
  content: '';
  position: absolute;
  width: 350px;
  height: 350px;
  border: 1px solid rgba(201,169,110,0.12);
  border-radius: 50%;
}
.featured-visual svg {
  width: 200px;
  height: 200px;
  opacity: 0.3;
  position: relative;
  z-index: 1;
}
.featured-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 70px;
}
.featured-content .section-label {
  text-align: left;
  margin-bottom: 20px;
}
.featured-content h2 {
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 300;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 24px;
}
.featured-content h2 strong {
  font-weight: 700;
}
.featured-content p {
  font-size: 15px;
  color: rgba(255,255,255,0.5);
  line-height: 1.8;
  margin-bottom: 36px;
}
.feature-list {
  list-style: none;
  margin-bottom: 40px;
}
.feature-list li {
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 12px;
}
.feature-list li::before {
  content: '◆';
  color: var(--accent);
  font-size: 8px;
}
.categories-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.category-card {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, #1a1a2e, #2a2a4a);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 36px;
  cursor: pointer;
  transition: transform 0.4s;
  text-decoration: none;
}
.category-card:hover {
  transform: scale(1.02);
}
.category-card.wide {
  grid-column: span 2;
  height: 260px;
  background: linear-gradient(135deg, #0f3460, #1a1a2e);
}
.category-geo {
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
  opacity: 0.08;
}
.category-info h3 {
  font-size: 24px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 8px;
}
.category-info p {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  max-width: 300px;
  line-height: 1.6;
}
.category-count {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 12px;
  color: var(--accent);
  letter-spacing: 2px;
  font-weight: 600;
}
.advantages {
  background: var(--bg-light);
}
.advantages-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}
.advantage-card {
  text-align: center;
  padding: 40px 24px;
  background: #fff;
  border-radius: 4px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.advantage-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.06);
}
.advantage-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201,169,110,0.1);
  border-radius: 50%;
}
.advantage-icon svg {
  width: 24px;
  height: 24px;
  stroke: var(--accent);
  fill: none;
  stroke-width: 1.5;
}
.advantage-card h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
}
.advantage-card p {
  font-size: 13px;
  color: var(--text-light);
  line-height: 1.7;
}
.cta {
  background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
  text-align: center;
  padding: 100px 40px;
  position: relative;
  overflow: hidden;
}
.cta::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border: 1px solid rgba(201,169,110,0.06);
  border-radius: 50%;
  top: -200px;
  left: -200px;
}
.cta h2 {
  font-size: clamp(28px, 4vw, 44px);
  color: #fff;
  font-weight: 300;
  margin-bottom: 18px;
  position: relative;
}
.cta h2 strong {
  font-weight: 700;
}
.cta p {
  font-size: 16px;
  color: rgba(255,255,255,0.5);
  max-width: 500px;
  margin: 0 auto 40px;
  line-height: 1.7;
}
.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
}
footer {
  background: var(--bg-dark);
  padding: 70px 40px 30px;
}
.footer-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 50px;
  margin-bottom: 50px;
}
.footer-brand .logo {
  display: inline-block;
  margin-bottom: 16px;
}
.footer-brand p {
  font-size: 14px;
  color: rgba(255,255,255,0.35);
  line-height: 1.7;
  max-width: 280px;
}
.footer-col h4 {
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
  font-weight: 600;
}
.footer-col a {
  display: block;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  font-size: 14px;
  padding: 5px 0;
  transition: color 0.3s;
}
.footer-col a:hover {
  color: #fff;
}
.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.footer-bottom p {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
}
.footer-bottom-links {
  display: flex;
  gap: 24px;
}
.footer-bottom-links a {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
  text-decoration: none;
  transition: color 0.3s;
}
.footer-bottom-links a:hover {
  color: rgba(255,255,255,0.6);
}
.mobile-menu {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(15,15,26,0.98);
  z-index: 999;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}
.mobile-menu.active {
  display: flex;
}
.mobile-menu a {
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
}
.mobile-close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
@media (max-width: 1024px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .advantages-grid { grid-template-columns: repeat(2, 1fr); }
  .featured { grid-template-columns: 1fr; }
  .featured-visual { height: 350px; }
  .featured-content { padding: 50px 40px; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
  nav { padding: 16px 20px; }
  section { padding: 70px 20px; }
  .stats-container { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .products-grid { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: 1fr; }
  .category-card.wide { grid-column: span 1; }
  .advantages-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 30px; }
}
.fade-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 预加载样式 */
.preloader {
  position: fixed;
  inset: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}
.preloader.hidden {
  opacity: 0;
  visibility: hidden;
}
.progress-ring {
  position: relative;
  width: 120px;
  height: 120px;
}
.progress-ring__circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 8;
  transform: rotate(-90deg);
  transform-origin: center;
}
.progress-ring__circle {
  fill: none;
  stroke: var(--accent);
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.1s ease;
}
.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 600;
  color: var(--primary);
}

/* 返回顶部按钮 */
.back-top-btn {
  position: fixed;
  top: 50rem;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99;
  transition: 0.2s;
}
.back-top-btn:hover {
  background: var(--accent);
}
</style>