// 简单的本地模拟认证，不调用任何后端。
// 使用 localStorage 保存用户列表，用 cookie 保存登录会话（mock_session），以便在页面刷新/新标签页判断是否已登录。
const USERS_KEY = 'mock_users'
const USER_KEY = 'mock_user'
const SESSION_COOKIE = 'mock_session'

function getUsers() {
  const s = localStorage.getItem(USERS_KEY)
  return s ? JSON.parse(s) : []
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function setCookie(name, value, days) {
  const expires = days ? `; expires=${new Date(Date.now() + days*864e5).toUTCString()}` : ''
  document.cookie = `${name}=${encodeURIComponent(value || '')}${expires}; path=/`
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts.slice(1).join('=')) : r
  }, '') || null
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export async function register(username, password, meta = {}) {
  if (!username || !password) throw new Error('Username and password are required')
  const users = getUsers()
  if (users.find(u => u.username === username || u.email === meta.email || u.phone === meta.phone)) {
    throw new Error('Username, email or phone already exists')
  }
  users.push({ username, password, email: meta.email || '', phone: meta.phone || '' })
  saveUsers(users)
}

export async function login(identifier, password) {
  const users = getUsers()
  const u = users.find(x => {
    const matchByUsername = x.username === identifier && x.password === password
    const matchByEmail = x.email && x.email === identifier && x.password === password
    const matchByPhone = x.phone && x.phone === identifier && x.password === password
    return matchByUsername || matchByEmail || matchByPhone
  })
  if (!u) throw new Error('Invalid username or password')
  localStorage.setItem(USER_KEY, JSON.stringify({ username: u.username, email: u.email, phone: u.phone }))
  setCookie(SESSION_COOKIE, u.username, 7)
  return { username: u.username, email: u.email, phone: u.phone }
}

export function getUser() {
  // 优先通过 cookie 判断会话
  const cookieUser = getCookie(SESSION_COOKIE)
  if (cookieUser) return { username: cookieUser }
  const s = localStorage.getItem(USER_KEY)
  return s ? JSON.parse(s) : null
}

export function logout() {
  localStorage.removeItem(USER_KEY)
  deleteCookie(SESSION_COOKIE)
}
