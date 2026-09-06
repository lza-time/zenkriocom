// 封装认证接口：优先调用后端 API（使用 axios），若未配置或请求失败则回退到本地 mock 实现
let axiosAvailable = true

import * as mock from '@/mock/auth.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
const SESSION_COOKIE = 'mock_session'

async function post(path, payload) {
  try {
    const axios = (await import('axios')).default
    return axios.post(`${API_BASE}${path}`, payload)
  } catch (e) {
    axiosAvailable = false
    throw new Error('no-axios')
  }
}

export async function sendCode(type, value) {
  if (API_BASE && axiosAvailable) {
    try {
      const res = await post('/auth/send-code', { type, value })
      return res.data
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Send code failed'
      throw new Error(msg)
    }
  }

  return { success: true, code: '123456' }
}

export async function register(username, password, extra = {}) {
  if (API_BASE && axiosAvailable) {
    try {
      const res = await post('/auth/register', { username, password, ...extra })
      return res.data
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Register failed'
      throw new Error(msg)
    }
  }
  return mock.register(username, password, extra)
}

export async function login(identifier, password) {
  if (API_BASE && axiosAvailable) {
    try {
      const res = await post('/auth/login', { identifier, password })
      const data = res.data || {}
      const val = data.user?.username || data.username || data.token || identifier
      document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(val)}; path=/; max-age=${7*24*3600}`
      localStorage.setItem('mock_user', JSON.stringify({
        username: data.user?.username || data.username || identifier,
        email: data.user?.email,
        phone: data.user?.phone,
        role: data.user?.role || 'user'
      }))
      if (data.token) localStorage.setItem('auth_token', data.token)
      return {
        username: data.user?.username || data.username || identifier,
        email: data.user?.email,
        phone: data.user?.phone,
        role: data.user?.role || 'user',
        token: data.token
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Login failed'
      throw new Error(msg)
    }
  }
  const res = await mock.login(identifier, password)
  return { username: res.username, email: res.email, phone: res.phone }
}

export function getUser() {
  // 优先使用 localStorage 中的用户信息（如果后端返回 username），再回退到 cookie，再回退到 mock
  const local = localStorage.getItem('mock_user')
  if (local) {
    try { return JSON.parse(local) } catch {}
  }
  const token = localStorage.getItem('auth_token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''))
      if (payload?.username) return { username: payload.username }
    } catch {}
  }
  if (API_BASE && axiosAvailable) {
    const cookie = document.cookie.split('; ').reduce((r,v)=>{const p=v.split('=');return p[0]===SESSION_COOKIE?decodeURIComponent(p.slice(1).join('=')):r}, '')
    if (cookie) return { username: cookie }
  }
  return mock.getUser()
}

export function logout() {
  if (API_BASE && axiosAvailable) {
    try {
      import('axios').then(axios => axios.default.post(`${API_BASE}/auth/logout`).catch(()=>{}))
    } catch {}
    document.cookie = `${SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    localStorage.removeItem('mock_user')
    localStorage.removeItem('auth_token')
    return
  }
  localStorage.removeItem('auth_token')
  localStorage.removeItem('mock_user')
  return mock.logout()
}
