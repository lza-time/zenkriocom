<template>
  <!-- ✅ 路由出口，必须存在 -->
  <router-view />
</template>

<script setup>
// 空即可，无需额外代码
</script>

<style>
/* 全局样式 */
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
</style>