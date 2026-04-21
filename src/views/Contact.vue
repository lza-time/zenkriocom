<template>
  <div class="contact-page">
    <header class="contact-header">
      <router-link to="/" class="back-home">← Back to Home</router-link>
    </header>

    <div class="contact-container">
      <!-- 左侧文字 + 联系方式 -->
      <div class="contact-left">
        <h2>We’d Love To Hear From You.</h2>
        <p>
          Have a question, idea, or project in mind? Our team is
          ready to help. Fill out the form below or reach out
          directly—we’ll get back to you as quickly as possible.
        </p>

        <div class="contact-info">
          <div class="info-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span>+86 18899810314</span>
          </div>
          <div class="info-item">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>info@zenkrio.com</span>
          </div>
        </div>
      </div>

      <!-- 右侧表单 -->
      <div class="contact-right">
        <div class="form-card">
          <h3 class="form-title">Contact Form</h3>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name</label>
              <input v-model="form.name" placeholder="Your name" required />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input v-model="form.phone" placeholder="Your phone" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" placeholder="Your email" required type="email" />
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea v-model="form.message" placeholder="Your message" required rows="6"></textarea>
            </div>
            <button type="submit" :disabled="loading">
              {{ loading ? 'Sending...' : 'Send' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- 自定义弹窗 -->
    <div v-if="modal.show" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-icon" :class="modal.type">
          <svg v-if="modal.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <svg v-if="modal.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h3>{{ modal.title }}</h3>
        <p>{{ modal.message }}</p>
        <button class="modal-btn" @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: ''
})
const loading = ref(false)

// 弹窗状态
const modal = ref({
  show: false,
  type: 'success', // success / error
  title: '',
  message: ''
})

// 打开弹窗
const openModal = (type, title, message) => {
  modal.value = { show: true, type, title, message }
}

// 关闭弹窗
const closeModal = () => {
  modal.value.show = false
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await fetch("https://formsubmit.co/ajax/info@zenkrio.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        message: form.value.message,
      })
    })

    const data = await response.json()

    if (data.success === "true") {
      openModal(
          'success',
          'Message Sent!',
          'Thank you for your inquiry. Our team will get back to you within 24 hours.'
      )
      form.value = { name: "", phone: "", email: "", message: "" }
    } else {
      openModal(
          'error',
          'Failed to Send',
          'Please try again or contact us via WhatsApp: +86 18899810314'
      )
    }
  } catch (error) {
    openModal(
        'error',
        'Network Error',
        'Please check your connection and try again.'
    )
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:root {
  --primary: #1a1a2e;
  --accent: #c9a96e;
  --text: #333;
  --text-light: #777;
  --bg-light: #f7f6f3;
  --success: #2ecc71;
  --error: #e74c3c;
}

.contact-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 100px 20px;
}

.contact-header {
  margin-bottom: 60px;
}

.back-home {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

.contact-left h2 {
  font-size: 42px;
  color: var(--primary);
  margin-bottom: 24px;
  font-weight: 300;
  line-height: 1.2;
}

.contact-left p {
  color: var(--text);
  line-height: 1.8;
  margin-bottom: 40px;
  font-size: 16px;
}

.contact-info {
  border: 1px solid #eee;
  padding: 24px;
  border-radius: 4px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: var(--text);
}

.info-item:last-child {
  margin-bottom: 0;
}

.icon {
  width: 18px;
  height: 18px;
  color: var(--text-light);
}

.form-card {
  background: var(--bg-light);
  padding: 40px;
  border-radius: 8px;
}

.form-title {
  text-align: center;
  color: var(--primary);
  font-size: 36px;
  font-weight: 300;
  margin: 0 0 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: var(--text);
  margin-bottom: 8px;
  font-size: 16px;
}

form input,
form textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  background: #fff;
}

form textarea {
  resize: vertical;
}

form button {
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 18px;
  transition: background 0.3s;
}

form button:hover:not(:disabled) {
  background: #2a2a4a;
}

form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 自定义弹窗样式 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon.success {
  background: rgba(46, 204, 113, 0.1);
  color: var(--success);
}

.modal-icon.error {
  background: rgba(231, 76, 60, 0.1);
  color: var(--error);
}

.modal-icon svg {
  width: 30px;
  height: 30px;
}

.modal-content h3 {
  color: var(--primary);
  margin-bottom: 12px;
}

.modal-content p {
  color: var(--text-light);
  margin-bottom: 24px;
  line-height: 1.6;
}

.modal-btn {
  padding: 12px 32px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.modal-btn:hover {
  background: #2a2a4a;
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .contact-left h2 {
    font-size: 32px;
  }
}
</style>