<template>
  <div class="app-shell">
    <transition name="preloader-fade">
      <div v-if="isLoading" class="preloader" aria-label="Loading ZENKRIO" role="status">
        <div class="preloader-mark">ZENK<span>RIO</span></div>
        <div class="preloader-track" aria-hidden="true">
          <div class="preloader-progress"></div>
        </div>
        <p>Preparing your experience</p>
      </div>
    </transition>

    <router-view />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const isLoading = ref(true)

onMounted(() => {
  fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/analytics/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: window.location.pathname })
  }).catch(() => {})

  const finishLoading = () => {
    window.setTimeout(() => {
      isLoading.value = false
    }, 650)
  }

  if (document.readyState === 'complete') {
    finishLoading()
  } else {
    window.addEventListener('load', finishLoading, { once: true })
  }
})
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app-shell {
  min-height: 100vh;
}
.preloader {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background:
    radial-gradient(circle at 50% 45%, rgba(201,169,110,0.1), transparent 30%),
    #0b1220;
  color: rgba(255,255,255,0.6);
}
.preloader-mark {
  color: #fff;
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 700;
  letter-spacing: 0.28em;
  padding-left: 0.28em;
}
.preloader-mark span {
  color: #c9a96e;
}
.preloader-track {
  width: min(220px, 52vw);
  height: 1px;
  overflow: hidden;
  background: rgba(255,255,255,0.18);
}
.preloader-progress {
  width: 45%;
  height: 100%;
  background: #c9a96e;
  animation: preloaderProgress 1.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.preloader p {
  margin: 0;
  color: rgba(255,255,255,0.42);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.preloader-fade-leave-active {
  transition: opacity 420ms ease, visibility 420ms ease;
}
.preloader-fade-leave-to {
  opacity: 0;
  visibility: hidden;
}
@keyframes preloaderProgress {
  from { transform: translateX(-100%); }
  to { transform: translateX(225%); }
}
:root {
  --primary: #0f1724;
  --accent: #ffd58a;
  --accent-2: #c9a96e;
  --muted: rgba(255,255,255,0.6);
  --bg-dark: #071029;
}
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text);
  background: linear-gradient(180deg,#071029,#081426);
  overflow-x: hidden;
  line-height: 1.6;
}

.site-header { padding: 18px 28px; background: transparent }
.nav { display:flex; gap:18px; align-items:center }
.nav a { color: var(--muted); text-decoration:none; padding:6px 10px; border-radius:6px; transition: color 160ms ease, transform 160ms ease, background 160ms ease }
.nav a:hover { color: #fff; transform: translateY(-3px); background: rgba(255,255,255,0.03) }
.nav a.router-link-active { color: #fff; background: rgba(255,255,255,0.04) }
.spacer { flex:1 }
.user { display:flex; gap:10px; align-items:center }
.user button { padding:6px 10px; border-radius:8px; border:none; background: linear-gradient(90deg,var(--accent),var(--accent-2)); color:#111; font-weight:600 }

</style>