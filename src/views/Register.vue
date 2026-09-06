<template>
  <div class="auth-hero">
      <div class="auth-card">
        <button class="back-btn" type="button" @click="goHome" aria-label="Back to home">← Back</button>
        <div class="brand">TRAE Style</div>
        <h2>Create account</h2>
      <form @submit.prevent="submit" class="auth-form">
        <input placeholder="Username" v-model="username" required />
        <input type="password" placeholder="Password" v-model="password" required />
        <button type="submit" class="primary">Register</button>
        <p class="error" v-if="error">{{ error }}</p>
        <p class="success" v-if="success">Registered successfully — please login.</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/authService.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)

async function submit() {
  error.value = ''
  success.value = false
  try {
    await register(username.value, password.value)
    success.value = true
    username.value = ''
    password.value = ''
  } catch (e) {
    error.value = e.message || String(e)
  }
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.auth-hero {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f1724 0%, #071029 60%);
  padding: 40px 16px;
}
.auth-card {
  width: 100%;
  max-width: 420px;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border-radius: 12px;
  padding: 28px;
  position: relative;
  box-shadow: 0 10px 30px rgba(2,6,23,0.6);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.06);
  animation: floatIn 420ms cubic-bezier(.2,.9,.3,1) both;
}
.brand { font-weight:700; font-size:18px; color:#ffd58a; margin-bottom:8px }
.auth-card h2 { margin: 6px 0 18px; font-size:22px }
.back-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.8);
  font-size: 13px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 140ms ease, transform 140ms ease;
}
.back-btn:hover { background: rgba(255,255,255,0.03); transform: translateY(-2px) }
.auth-form input {
  width:100%;
  padding:12px 14px;
  margin-bottom:12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  color:#fff;
  border-radius:8px;
  transition: box-shadow 180ms ease, transform 140ms ease, border-color 140ms ease, background 140ms ease;
}
.auth-form input::placeholder { color: rgba(255,255,255,0.5) }
.auth-form input:focus {
  outline: none;
  transform: translateY(-2px);
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,213,138,0.9);
  box-shadow: 0 10px 30px rgba(201,169,110,0.12);
}
.auth-form .primary {
  width:100%;
  padding:12px;
  border-radius:8px;
  background: linear-gradient(90deg,#ffd58a,#c9a96e);
  border:none;
  color:#111;
  font-weight:600;
  transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}
.auth-form .primary:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(201,169,110,0.18) }
.auth-form .primary:active { transform: translateY(-1px); opacity: 0.98 }
.error { color:#ff7b7b; margin-top:8px }
.success { color:#7fffbf; margin-top:8px }

@keyframes floatIn {
  from { opacity:0; transform: translateY(12px) scale(.995) }
  to { opacity:1; transform: translateY(0) scale(1) }
}
</style>
