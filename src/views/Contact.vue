<template>
  <div class="contact-page">
    <header class="contact-header">
      <router-link to="/" class="back-home">← Back to Home</router-link>
      <h1>Contact Business Team</h1>
    </header>

    <div class="contact-container">
      <div class="contact-left">
        <h2>We’re Ready To Cooperate With You</h2>
        <p>Please fill in the form, we will reply to you within 24 hours.</p>
      </div>

      <div class="contact-right">
        <form @submit.prevent="handleSubmit">
          <input v-model="form.name" placeholder="Your Name" required />
          <input v-model="form.email" placeholder="Your Email" required type="email" />
          <input v-model="form.phone" placeholder="Your Phone" />
          <textarea v-model="form.message" placeholder="Your Message" required rows="5"></textarea>
          <button type="submit" :disabled="loading">
            {{ loading ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    alert('Message sent successfully!')
    form.value = { name: '', email: '', phone: '', message: '' }
  } catch (err) {
    alert('Send failed, please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:root {
  --primary: #1a1a2e;
  --accent: #c9a96e;
}

.contact-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 100px 20px;
}

.contact-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 50px;
}

.back-home {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.contact-header h1 {
  font-size: 24px;
  color: var(--primary);
  margin: 0;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.contact-left h2 {
  font-size: 32px;
  color: var(--primary);
  margin-bottom: 16px;
}

.contact-left p {
  color: #666;
  line-height: 1.6;
}

.contact-right form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

form input,
form textarea {
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
}

form button {
  padding: 14px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

form button:disabled {
  background: #666;
}
</style>