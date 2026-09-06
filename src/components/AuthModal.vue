<template>
  <div class="auth-modal-backdrop" @click.self="close">
    <div class="auth-modal">
      <button class="close" @click="close">✕</button>

      <div class="auth-panel">
        <aside class="brand-panel">
          <div class="brand-badge">Z</div>
          <div class="brand-copy">
            <p class="eyebrow">Welcome back</p>
            <h2>Secure access, smarter workflow.</h2>
          </div>

          <ul class="feature-list">
            <li>Fast login experience</li>
            <li>Multi-factor protection</li>
            <li>Private and trusted access</li>
          </ul>

          <div class="brand-footer">
            <span class="dot"></span>
            Trusted by global teams
          </div>
        </aside>

        <section class="form-panel">
          <div class="brand-bar">
            <div>
              <div class="brand-title">Welcome</div>
              <div class="brand-sub">Secure account access</div>
            </div>
          </div>

          <div class="tabs">
            <button :class="{active: modeLocal==='login'}" @click="modeLocal='login'">Login</button>
            <button :class="{active: modeLocal==='register'}" @click="modeLocal='register'">Register</button>
          </div>

          <div v-if="modeLocal==='login'" class="form">
            <div class="login-mode-switch">
              <button :class="{active: loginMode==='account'}" @click="loginMode='account'">Account</button>
              <button :class="{active: loginMode==='email'}" @click="loginMode='email'">Email</button>
            </div>

            <div v-if="loginMode==='account'">
              <input v-model="loginUser" placeholder="Username" />
              <input v-model="loginPass" type="password" placeholder="Password" />
            </div>

            <div v-if="loginMode==='email'">
              <input v-model="loginEmail" placeholder="Email" />
              <input v-model="loginPass" type="password" placeholder="Password" />
            </div>

            <div v-if="captchaRequired" class="captcha-box">
              <div class="captcha-label">Security verification</div>
              <div class="captcha-visual">{{ captchaText }}</div>
              <input v-model="captchaInput" placeholder="Enter verification code" />
            </div>

            <div class="form-row-inline">
              <label class="remember">
                <input type="checkbox" v-model="rememberMe" /> Remember me
              </label>
            </div>

            <button class="primary" @click="doLogin">Login</button>
            <p class="note">Choose a login method: account, phone or email.</p>
            <p class="error" v-if="error">{{ error }}</p>
          </div>

          <div v-if="modeLocal==='register'" class="form">
            <input v-model="regUser" placeholder="Username" />
            <input v-model="regEmail" type="email" placeholder="Email address" />
            <input v-model="regPhone" placeholder="Phone (optional)" />
            <input v-model="regCode" placeholder="Verification code" />
            <button class="code-btn" :disabled="codeTimer>0" @click="sendCode('register')">
              <span v-if="codeTimer===0">Send Verification Code</span>
              <span v-else>{{ codeTimer }}s</span>
            </button>
            <p v-if="devCode" class="dev-code">Development code: {{ devCode }}</p>
            <input v-model="regPass" type="password" placeholder="Password" />
            <button class="primary" @click="doRegister">Register</button>
            <p class="error" v-if="error">{{ error }}</p>
            <p class="success" v-if="success">Registered successfully — please login.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { login, register, sendCode as requestCode } from '@/services/authService.js'
import { defineEmits, defineProps } from 'vue'

const props = defineProps({ mode: { type: String, default: 'login' } })
const emits = defineEmits(['close', 'logged'])
const modeLocal = ref(props.mode || 'login')
const loginMode = ref('account')
const loginUser = ref('')
const loginPass = ref('')
const loginEmail = ref('')
const loginPhone = ref('')
const loginCode = ref('')
const rememberMe = ref(false)
const regUser = ref('')
const regPass = ref('')
const regEmail = ref('')
const regPhone = ref('')
const regCode = ref('')
const codeTimer = ref(0)
let codeInterval = null
const loginFailCount = ref(0)
const captchaRequired = ref(false)
const captchaText = ref('')
const captchaInput = ref('')
const error = ref('')
const success = ref(false)
const devCode = ref('')

watch(modeLocal, () => {
  error.value = ''
  success.value = false
  rememberMe.value = false
  if (codeInterval) { clearInterval(codeInterval); codeInterval = null; codeTimer.value = 0 }
  loginFailCount.value = 0
  captchaRequired.value = false
  captchaInput.value = ''
  captchaText.value = ''
  devCode.value = ''
})

watch(() => props.mode, v => { if (v) modeLocal.value = v })

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 5; i++) result += chars[Math.floor(Math.random() * chars.length)]
  captchaText.value = result
  captchaInput.value = ''
  return result
}

async function doLogin() {
  error.value = ''

  if (loginFailCount.value >= 3) {
    if (!captchaRequired.value) {
      captchaRequired.value = true
      generateCaptcha()
    }
    if ((captchaInput.value || '').trim().toUpperCase() !== (captchaText.value || '').toUpperCase()) {
      error.value = 'Please complete the verification code.'
      return
    }
  }

  try {
    let identifier = ''
    let passwordValue = ''

    if (loginMode.value === 'account') {
      identifier = loginUser.value
      passwordValue = loginPass.value
    } else if (loginMode.value === 'phone') {
      identifier = loginPhone.value
      passwordValue = loginCode.value
    } else {
      identifier = loginEmail.value
      passwordValue = loginPass.value
    }

    const res = await login(identifier, passwordValue)

    if (rememberMe.value) {
      try {
        if (res && res.token) localStorage.setItem('auth_token', res.token)
        if (res && res.username) localStorage.setItem('mock_user', JSON.stringify({ username: res.username }))
      } catch {}
    }

    loginFailCount.value = 0
    captchaRequired.value = false
    captchaInput.value = ''
    captchaText.value = ''
    emits('logged', res)
    emits('close')
  } catch (e) {
    loginFailCount.value += 1
    if (loginFailCount.value >= 3) {
      captchaRequired.value = true
      generateCaptcha()
      error.value = 'Too many failed attempts. Please complete the verification code.'
    } else {
      error.value = e.message || String(e)
    }
  }
}

async function doRegister() {
  error.value = ''
  success.value = false
  if (!regUser.value || !regPass.value || regPass.value.length < 8 || !regEmail.value || !regCode.value) {
    error.value = 'Username, password (8+ characters), email and verification code are required.'
    return
  }
  try {
    await register(regUser.value, regPass.value, {
      email: regEmail.value,
      phone: regPhone.value,
      verificationCode: regCode.value
    })
    success.value = true
    regUser.value = ''
    regPass.value = ''
    regEmail.value = ''
    regPhone.value = ''
    regCode.value = ''
    devCode.value = ''
    // switch to login tab
    modeLocal.value = 'login'
  } catch (e) {
    error.value = e.message || String(e)
  }
}

function close() { emits('close') }

async function sendCode(mode) {
  const phone = mode === 'login' ? loginPhone.value : regPhone.value
  const email = mode === 'login' ? loginEmail.value : regEmail.value

  if (mode === 'register' && !email) {
    error.value = 'Please provide an email address to receive the verification code.'
    return
  }
  if (!phone && !email) {
    error.value = 'Please provide phone or email to receive code.'
    return
  }

  error.value = ''

  try {
    const value = mode === 'register' ? email : (phone || email)
    const type = 'email'
    const response = await requestCode(type, value)
    devCode.value = response?.devCode || ''
    codeTimer.value = 60
    if (codeInterval) clearInterval(codeInterval)
    codeInterval = setInterval(() => {
      codeTimer.value -= 1
      if (codeTimer.value <= 0) {
        clearInterval(codeInterval)
        codeInterval = null
      }
    }, 1000)
  } catch (e) {
    error.value = e.message || String(e)
  }
}

// 清理定时器（组件销毁时由上层管理，此处为防护）
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => { if (codeInterval) clearInterval(codeInterval) })
}
</script>

<style scoped>
.auth-modal-backdrop { position: fixed; inset:0; background: rgba(2,6,23,0.70); display:flex; align-items:center; justify-content:center; z-index:2000; backdrop-filter: blur(3px); }
.auth-modal { width: 790px; max-width: calc(100% - 40px); background: linear-gradient(180deg, rgba(10,17,28,0.99) 0%, rgba(12,24,36,0.99) 100%); padding: 18px; border-radius: 22px; color:#fff; position: relative; box-shadow: 0 28px 64px rgba(2,6,23,0.7), inset 0 1px 0 rgba(255,255,255,0.06); font-size:14px; border:1px solid rgba(255,255,255,0.08); }
.auth-panel { display:grid; grid-template-columns: 290px 1fr; overflow:hidden; border-radius:16px; }
.brand-panel { position:relative; padding: 24px 22px; background: linear-gradient(180deg, #0d1b29 0%, #112d3d 42%, #173d55 100%); display:flex; flex-direction:column; justify-content:space-between; min-height: 500px; }
.brand-panel::before { content:''; position:absolute; inset:0; background: linear-gradient(140deg, rgba(255,213,138,0.08), transparent 34%, rgba(97,166,255,0.10) 100%); pointer-events:none; }
.brand-badge { width:52px; height:52px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-weight:800; color:#0d1726; background: linear-gradient(135deg,#f7d28d,#d7a55a); box-shadow: 0 14px 26px rgba(215,165,90,0.35); position:relative; z-index:1; }
.brand-copy { position:relative; z-index:1; }
.eyebrow { margin:0 0 10px; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color: rgba(255,255,255,0.68); }
.brand-copy h2 { margin:0; font-size:28px; line-height:1.14; letter-spacing:-0.04em; }
.feature-list { position:relative; z-index:1; list-style:none; padding:0; margin:18px 0 0; display:flex; flex-direction:column; gap:12px; color:rgba(255,255,255,0.9); }
.feature-list li { position:relative; padding-left:18px; font-size:13px; }
.feature-list li::before { content:'•'; position:absolute; left:0; color:#ffd58a; }
.brand-footer { position:relative; z-index:1; display:flex; align-items:center; gap:8px; font-size:12px; color: rgba(255,255,255,0.72); }
.dot { width:8px; height:8px; border-radius:50%; background:#8ef0ba; box-shadow:0 0 10px rgba(142,240,186,0.8); }
.form-panel { background: linear-gradient(180deg, rgba(7,16,25,0.94) 0%, rgba(10,20,31,0.98) 100%); padding: 22px 26px 18px; }
.auth-modal .close { position:absolute; right:18px; top:18px; width:32px; height:32px; border-radius:50%; background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#fff; font-size:18px; cursor:pointer; }
.brand-bar { display:flex; align-items:center; gap:12px; padding: 4px 0 16px; border-bottom:1px solid rgba(255,255,255,0.07); margin-bottom:16px; }
.brand-title { font-size: 18px; font-weight: 700; }
.brand-sub { font-size:12px; color: rgba(255,255,255,0.66); }
.tabs { display:flex; gap:8px; margin-bottom:16px; padding:4px; background: rgba(255,255,255,0.02); border-radius:12px; border:1px solid rgba(255,255,255,0.06); }
.tabs button { flex:1; padding:9px 12px; background:transparent; border:none; border-radius:10px; color:#fff; cursor:pointer; font-weight:600; transition: all .2s ease; }
.tabs button.active { background: linear-gradient(90deg,#ffd58a,#c9a96e); color:#111; box-shadow: 0 8px 16px rgba(215,165,90,0.35); }
.login-mode-switch { display:flex; gap:8px; margin-bottom:12px }
.login-mode-switch button { flex:1; padding:8px 10px; background: rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); color:#fff; border-radius:8px; cursor:pointer; transition: all .2s ease; }
.login-mode-switch button.active { background: linear-gradient(90deg,#ffd58a,#c9a96e); color:#111; border:none; box-shadow: 0 8px 14px rgba(215,165,90,0.25); }
.form input { width:100%; padding:11px 12px; margin-bottom:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color:#fff; box-shadow: inset 0 1px 2px rgba(0,0,0,0.18); transition: border-color .2s ease, box-shadow .2s ease; }
.form input:focus { outline:none; border-color: rgba(255,213,138,0.7); box-shadow: 0 0 0 3px rgba(255,213,138,0.1); }
.row { display:flex; gap:12px }
.row .code-wrap { flex:1; display:flex; gap:8px }
.row .code-wrap input { flex:1 }
.code-btn { width:100%; padding:10px 12px; border-radius:8px; border:none; background: rgba(255,255,255,0.06); color:#fff; cursor:pointer; margin-bottom:10px; transition: all .2s ease; }
.code-btn:hover { background: rgba(255,255,255,0.09); }
.code-btn:disabled { opacity:0.6; cursor:default }
.dev-code { margin: -2px 0 10px; color: #f0c982; font-size: 12px; }
.form-row-inline { display:flex; justify-content:flex-end; margin: 2px 0 10px }
.remember { display:inline-flex; align-items:center; gap:8px; font-size:13px; color:rgba(255,255,255,0.8); padding:6px 10px; border-radius:999px; background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06) }
.remember input { width:14px; height:14px; margin:0 }
.captcha-box { margin: 0 0 12px; padding: 12px; border:1px solid rgba(255,255,255,0.08); border-radius:10px; background: rgba(255,255,255,0.02) }
.captcha-label { font-size:12px; color: rgba(255,255,255,0.7); margin-bottom:8px }
.captcha-visual { display:inline-block; padding:8px 12px; margin-bottom:8px; border-radius:8px; background: linear-gradient(90deg,#ffd58a,#c9a96e); color:#111; font-weight:700; letter-spacing:2px }
.primary { width:100%; padding:12px; border:none; border-radius:10px; background: linear-gradient(90deg,#ffd58a,#c9a96e); color:#111; font-weight:700; cursor:pointer; box-shadow: 0 12px 22px rgba(215,165,90,0.25); transition: transform .2s ease, box-shadow .2s ease; }
.primary:hover { transform: translateY(-1px); box-shadow: 0 14px 24px rgba(215,165,90,0.3); }
.note { color: rgba(255,255,255,0.7); font-size:13px; margin-top:8px }
.error { color:#ff8b8b; margin-top:8px }
.success { color:#8ef0ba; margin-top:8px }

@media (max-width:720px) {
  .auth-panel { grid-template-columns:1fr; }
  .brand-panel { min-height: 220px; }
  .auth-modal { width: calc(100% - 20px); padding:12px }
  .form-panel { padding:18px 16px }
}
</style>
