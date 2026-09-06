<template>
  <div class="admin-shell">
    <aside class="sidebar">
      <div class="brand">ZENK<span>RIO</span><small>CONTROL CENTER</small></div>
      <nav>
        <button v-if="can('overview')" :class="{ active: section === 'overview' }" @click="section = 'overview'"><span class="nav-mark">01</span>Overview</button>
        <button v-if="can('products')" :class="{ active: section === 'products' }" @click="section = 'products'"><span class="nav-mark">02</span>Products</button>
        <button v-if="can('users')" :class="{ active: section === 'users' }" @click="section = 'users'"><span class="nav-mark">03</span>Users</button>
        <button v-if="can('content')" :class="{ active: section === 'content' }" @click="section = 'content'"><span class="nav-mark">04</span>Content</button>
      </nav>
      <button class="back" @click="$router.push('/')">Back to site</button>
    </aside>

    <main class="content">
      <header class="topbar">
        <div class="topbar-actions"><button class="refresh" :disabled="loading" @click="load"><span :class="{ spinning: loading }">↻</span> Refresh</button><div class="operator"><span class="dot"></span><span class="operator-name">{{ user?.username || 'Administrator' }}</span><button @click="logout">Sign out</button></div></div>
      </header>
      <div class="page-heading"><h1>{{ titles[section] }}</h1></div>

      <p v-if="error" class="error">{{ error }}</p>
      <section v-if="loading" class="loading">Loading dashboard...</section>

      <template v-else-if="section === 'overview'">
        <section class="metrics">
          <article><span>Total visits</span><strong>{{ overview.summary.visitCount || 0 }}</strong><small>All recorded sessions</small></article>
          <article><span>Registered users</span><strong>{{ overview.summary.userCount || 0 }}</strong><small>Accounts in database</small></article>
          <article><span>Published products</span><strong>{{ overview.summary.publishedProducts || 0 }}</strong><small>Visible on storefront</small></article>
          <article><span>Draft products</span><strong>{{ overview.summary.draftProducts || 0 }}</strong><small>Awaiting release</small></article>
        </section>
        <section class="dashboard-grid">
          <article class="panel chart-panel"><div class="panel-heading"><div><p class="eyebrow">TRAFFIC</p><h2>Visits over the last 7 days</h2></div><span class="chart-total">{{ overview.summary.visitCount || 0 }} total</span></div><div class="chart"><div v-for="item in chartBars" :key="item.date" class="bar-wrap"><span>{{ item.count }}</span><div class="bar" :style="{ height: `${item.height}%` }"></div><small>{{ item.label }}</small></div></div></article>
          <article class="panel"><div class="panel-heading"><div><p class="eyebrow">CATALOG</p><h2>Recent product activity</h2></div></div><div v-if="!overview.recentProducts.length" class="empty-state"><span>+</span><strong>No products yet</strong><small>Create your first catalog item to see activity here.</small><button class="text-action" @click="section = 'products'">Open catalog →</button></div><div v-for="product in overview.recentProducts" :key="product.id" class="activity"><span class="activity-icon">P</span><div><strong>{{ product.name }}</strong><small>{{ product.category }}</small></div><em :class="product.status">{{ product.status }}</em></div></article>
        </section>
      </template>

      <template v-else-if="section === 'users'">
        <div class="section-actions"><p>Manage access, status and contact information.</p><button class="primary" @click="openNewUser">+ Create user</button></div>
        <section class="table-panel"><div class="table-caption"><div><p class="eyebrow">DIRECTORY</p><h2>{{ users.length }} accounts</h2></div><span>Manage access and account status</span></div><table><thead><tr><th>Account</th><th>Contact</th><th>Role</th><th>Modules</th><th>Status</th><th>Created</th><th></th></tr></thead><tbody><tr v-for="item in users" :key="item.id"><td><strong>{{ item.username }}</strong><small>{{ item.id }}</small></td><td>{{ item.email || item.phone || '—' }}</td><td><select v-model="item.role" @change="updateUser(item)"><option value="user">User</option><option value="admin">Admin</option></select></td><td><button class="permission-summary" @click="openEditUser(item)">{{ item.role === 'admin' ? (item.permissions?.length || 0) + ' enabled' : 'None' }}</button></td><td><button class="status" :class="item.status" @click="toggleUser(item)">{{ item.status }}</button></td><td>{{ formatDate(item.createdAt) }}</td><td><button class="danger-link" @click="deleteUser(item)">Delete</button></td></tr></tbody></table></section>
      </template>

      <template v-else-if="section === 'content'">
        <div class="section-actions"><p>Update homepage statistics, copy and images. Changes sync to the public site.</p><span class="result-count">Showing {{ contentItems.length }} / 20 records</span></div>
        <section class="content-grid"><article v-for="item in contentItems" :key="item.id" class="content-card"><div class="content-image" @click="openEditContent(item)"><img v-if="item.imageUrl" :src="previewImage(item.imageUrl)" :alt="item.title"><span v-else>{{ item.contentType === 'stat' ? item.title : 'TEXT' }}</span><button type="button" @click.stop="openEditContent(item)">Edit content</button></div><div class="content-card-body"><div class="content-meta">{{ item.contentType }} / {{ item.contentKey }}</div><h3>{{ item.title || 'Untitled content' }}</h3><p>{{ item.subtitle || item.body || 'No description' }}</p></div></article></section>
        <section class="permission-panel"><div><p class="eyebrow">ACCESS POLICY</p><h2>Module visibility</h2><p>Choose an account, then select the admin areas it can use.</p></div><select class="permission-user-select" :value="selectedUser?.id || ''" @change="selectedUser = users.find(item => item.id === $event.target.value) || null"><option value="">Choose an account</option><option v-for="item in users" :key="item.id" :value="item.id">{{ item.username }} · {{ item.role }}</option></select><div v-if="selectedUser" class="permission-options"><label v-for="module in modules" :key="module"><input type="checkbox" :value="module" v-model="selectedUser.permissions"> <span>{{ module }}</span></label><button class="primary" @click="savePermissions">Save permissions</button></div></section>
      </template>

      <template v-else>
        <div class="section-actions"><p>Publish, pause and maintain your storefront catalog.</p><button class="primary" @click="openNewProduct">+ Add product</button></div>
        <section class="table-panel"><div class="table-caption"><div><p class="eyebrow">INVENTORY</p><h2>{{ products.length }} catalog items</h2></div><span>Drafts stay hidden from the storefront</span></div><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody><tr v-for="item in products" :key="item.id"><td><strong>{{ item.name }}</strong><small>{{ item.series || 'Independent product' }}</small></td><td>{{ item.category }}</td><td>${{ Number(item.price).toFixed(2) }}</td><td><span :class="{ 'low-stock': item.stock < 5 }">{{ item.stock }}</span></td><td><button class="status" :class="item.status" @click="toggleProduct(item)">{{ item.status }}</button></td><td><button class="edit-link" @click="openEditProduct(item)">Edit</button><button class="danger-link" @click="deleteProduct(item)">Delete</button></td></tr></tbody></table></section>
      </template>
    </main>

    <div v-if="modal" class="modal-backdrop" @click.self="modal = null"><form class="modal" @submit.prevent="saveModal"><button type="button" class="close" @click="modal = null">×</button><p class="eyebrow">{{ modal === 'user' ? 'ACCOUNT' : modal === 'product' ? 'CATALOG' : 'SITE CONTENT' }}</p><h2>{{ modal === 'content' ? 'Edit homepage content' : `${editing ? 'Edit' : 'Create'} ${modal}` }}</h2><template v-if="modal === 'content'"><div class="edit-preview"><img v-if="form.imageUrl" :src="previewImage(form.imageUrl)" alt="Preview"><span v-else>No image</span></div><label>Title<input v-model="form.title"></label><label>Subtitle<input v-model="form.subtitle"></label><label>Text<textarea v-model="form.body"></textarea></label><label>Image URL<input v-model="form.imageUrl" placeholder="https://... or /src/assets/1.png"></label></template><template v-else><label v-if="modal === 'user'">Username<input v-model="form.username" :disabled="editing" required></label><label v-if="modal === 'user' && !editing">Password<input v-model="form.password" type="password" required></label><label v-if="modal === 'user'">Email<input v-model="form.email" type="email"></label><label v-if="modal === 'user'">Phone<input v-model="form.phone"></label><label v-if="modal === 'user'">Role<select v-model="form.role"><option value="user">User</option><option value="admin">Admin</option></select></label><template v-else><label>Name<input v-model="form.name" required></label><label>Series<input v-model="form.series"></label><label>Category<input v-model="form.category" required></label><label>Description<textarea v-model="form.description"></textarea></label><div class="form-row"><label>Price<input v-model.number="form.price" type="number" min="0" step="0.01"></label><label>Stock<input v-model.number="form.stock" type="number" min="0"></label></div><label>Status<select v-model="form.status"><option value="draft">Draft</option><option value="published">Published</option></select></label></template></template><button class="primary full" type="submit">Save changes</button></form></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout as clearSession } from '@/services/authService'
import productImage from '@/assets/aurora-bathtub.svg'
import heroImage from '@/assets/hero-bathroom.svg'

const router = useRouter()
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
const user = ref(getUser())
const section = ref('overview')
const loading = ref(true)
const error = ref('')
const modal = ref(null)
const editing = ref(null)
const users = ref([])
const selectedUser = ref(null)
const products = ref([])
const contentItems = ref([])
const overview = ref({ summary: {}, visits: [], recentProducts: [] })
const form = ref({})
const titles = { overview: 'Command center', products: 'Product catalog', users: 'User directory', content: 'Site content' }
const modules = ['overview', 'products', 'users', 'content']
function can(module) { return user.value?.role === 'admin' && (user.value.permissions?.length ? user.value.permissions.includes(module) : true) }
function selectUser(item) { selectedUser.value = item }
async function savePermissions() { if (!selectedUser.value) return; try { await updateUser(selectedUser.value) } catch {} }
function previewImage(value) {
  if (value?.endsWith('/1.png') || value?.endsWith('/aurora-bathtub.svg')) return productImage
  if (value?.endsWith('/hero.png') || value?.endsWith('/hero-bathroom.svg')) return heroImage
  return value
}

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}`, ...(options.headers || {}) } })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}
async function load() {
  loading.value = true
  error.value = ''
  try {
    if (section.value === 'overview') overview.value = await api('/admin/overview')
    if (section.value === 'users') users.value = await api('/admin/users')
    if (section.value === 'products') products.value = await api('/admin/products')
    if (section.value === 'content') contentItems.value = await api('/admin/content?limit=20')
  } catch (err) { error.value = err.message } finally { loading.value = false }
}
const chartBars = computed(() => { const list = overview.value.visits || []; const max = Math.max(...list.map(item => item.count), 1); return list.map(item => ({ ...item, height: Math.max(item.count / max * 100, 8), label: item.date.slice(5) })) })
function formatDate(value) { return value ? new Date(value).toLocaleDateString() : '—' }
function openNewUser() { editing.value = null; form.value = { role: 'user', permissions: [] }; modal.value = 'user' }
function openEditUser(item) { editing.value = item; form.value = { ...item, permissions: [...(item.permissions || [])] }; modal.value = 'user' }
function openNewProduct() { editing.value = null; form.value = { status: 'draft', price: 0, stock: 0 }; modal.value = 'product' }
function openEditProduct(item) { editing.value = item; form.value = { ...item }; modal.value = 'product' }
function openEditContent(item) { editing.value = item; form.value = { ...item }; modal.value = 'content' }
async function saveModal() { if (loading.value) return; loading.value = true; try { if (modal.value === 'content') { await api(`/admin/content/${editing.value.id}`, { method: 'PATCH', body: JSON.stringify(form.value) }) } else if (modal.value === 'user') { if (editing.value) await api(`/admin/users/${editing.value.id}`, { method: 'PATCH', body: JSON.stringify(form.value) }); else await api('/admin/users', { method: 'POST', body: JSON.stringify(form.value) }) } else { const path = editing.value ? `/admin/products/${editing.value.id}` : '/admin/products'; await api(path, { method: editing.value ? 'PATCH' : 'POST', body: JSON.stringify(form.value) }) } modal.value = null; await load() } catch (err) { error.value = err.message; loading.value = false } }
async function updateUser(item) { try { await api(`/admin/users/${item.id}`, { method: 'PATCH', body: JSON.stringify(item) }) } catch (err) { error.value = err.message; throw err } }
async function toggleUser(item) { const previous = item.status; item.status = item.status === 'active' ? 'disabled' : 'active'; try { await updateUser(item) } catch { item.status = previous } }
async function deleteUser(item) { if (!window.confirm(`Delete ${item.username}?`)) return; await api(`/admin/users/${item.id}`, { method: 'DELETE' }); await load() }
async function toggleProduct(item) { const previous = item.status; item.status = item.status === 'published' ? 'draft' : 'published'; try { await api(`/admin/products/${item.id}`, { method: 'PATCH', body: JSON.stringify(item) }); await load() } catch (err) { item.status = previous; error.value = err.message } }
async function deleteProduct(item) { if (!window.confirm(`Delete ${item.name}?`)) return; await api(`/admin/products/${item.id}`, { method: 'DELETE' }); await load() }
function logout() { clearSession(); router.push('/') }
onMounted(async () => { if (user.value?.role !== 'admin') { router.push('/'); return } if (!can(section.value)) section.value = modules.find(module => can(module)) || 'overview'; await load() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap');
:global(body) { background: #f1f3f2; color: #14202b; font-family: 'DM Sans', sans-serif; }
* { box-sizing: border-box; }
.admin-shell { min-height: 100vh; display: grid; grid-template-columns: 256px minmax(0, 1fr); align-items: stretch; background: radial-gradient(circle at 75% 0%, rgba(206,177,126,.13), transparent 27%), #f1f3f2; }
.sidebar { position: relative; z-index: 2; grid-column: 1; width: 256px; min-width: 256px; min-height: 100vh; padding: 30px 18px 22px; background: #102329; color: #fff; display: flex; flex-direction: column; box-shadow: 14px 0 32px rgba(21,39,45,.08); overflow: hidden; }.sidebar:after { content: ''; width: 180px; height: 180px; position: absolute; left: -90px; bottom: 90px; border: 1px solid rgba(216,177,125,.18); border-radius: 50%; pointer-events: none; }
.brand { width: 100%; white-space: nowrap; font: 800 21px Manrope, sans-serif; letter-spacing: .14em; margin: 0 16px 68px; }.brand span { color: #d2aa6d; }.brand small { display: block; color: #71838a; font: 600 9px 'DM Sans'; letter-spacing: .18em; margin-top: 10px; }
.sidebar nav { display: grid; gap: 6px; }.sidebar nav button, .back { border: 0; color: #8ea0a6; background: transparent; padding: 14px 16px; text-align: left; border-radius: 7px; font: 600 13px 'DM Sans'; cursor: pointer; display: flex; align-items: center; gap: 13px; transition: background .2s, color .2s, transform .2s; }.sidebar nav button.active, .sidebar nav button:hover { color: #fff; background: linear-gradient(90deg, #2d4b54, #203a42); transform: translateX(3px); }.nav-mark { width: 22px; color: #667f86; font-size: 10px; }.active .nav-mark { color: #d5ad6f; }.back { margin-top: auto; border-top: 1px solid rgba(255,255,255,.12); border-radius: 0; padding: 24px 16px 0; }
.content { grid-column: 2; min-width: 0; width: 100%; max-width: 1500px; padding: 30px clamp(28px, 5vw, 76px) 44px; position: relative; z-index: 1; overflow: hidden; }.topbar { min-height: 46px; display: flex; justify-content: flex-end; align-items: center; margin-bottom: 18px; }.page-heading { padding: 0 0 30px; border-bottom: 1px solid #e1e7e4; margin-bottom: 28px; }.page-heading h1 { margin: 0; color: #183038; font: 800 clamp(27px, 3vw, 40px) Manrope; letter-spacing: -.04em; line-height: 1.08; }.topbar-actions { display: flex; align-items: center; gap: 22px; flex-shrink: 0; }.operator { color: #65747a; font-size: 13px; display: flex; gap: 10px; align-items: center; white-space: nowrap; }.operator button { border: 0; background: none; color: #a77e42; cursor: pointer; font-weight: 700; padding: 4px 0; }.dot { width: 8px; height: 8px; border-radius: 50%; background: #54b38b; box-shadow: 0 0 0 4px rgba(84,179,139,.12); }.refresh { min-width: 94px; border: 1px solid #dfe5e2; background: rgba(255,255,255,.74); color: #68777a; border-radius: 5px; padding: 10px 13px; cursor: pointer; font: 600 12px 'DM Sans'; }.refresh:hover { color: #9c763f; border-color: #cbb488; }.refresh span { display: inline-block; font-size: 17px; vertical-align: -2px; margin-right: 5px; }.spinning { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
.metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }.metrics article, .panel, .table-panel { background: rgba(255,255,255,.88); border: 1px solid #e3e9e6; border-radius: 9px; box-shadow: 0 16px 35px rgba(26,44,53,.055); }.metrics article { padding: 23px; position: relative; overflow: hidden; }.metrics article:after { content: ''; position: absolute; right: -18px; bottom: -26px; width: 90px; height: 90px; border: 1px solid rgba(197,155,93,.18); border-radius: 50%; }.metrics span, .metrics small { display: block; color: #859198; font-size: 12px; }.metrics strong { display: block; margin: 12px 0 7px; font: 800 32px Manrope; color: #183038; }.dashboard-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; }.panel { padding: 28px; min-height: 345px; }.panel-heading { display: flex; justify-content: space-between; align-items: flex-start; }.panel h2, .table-caption h2 { margin: 0; font: 700 18px Manrope; }.chart-total { color: #a77e42; font-size: 13px; }.chart { height: 215px; display: flex; align-items: end; justify-content: space-around; gap: 12px; padding-top: 38px; }.bar-wrap { height: 100%; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: end; gap: 8px; color: #9ba5a9; font-size: 11px; }.bar { width: min(34px, 70%); min-height: 8px; background: linear-gradient(#e4c78f, #a77e42); border-radius: 5px 5px 2px 2px; box-shadow: 0 7px 15px rgba(167,126,66,.16); }.activity { display: flex; align-items: center; gap: 12px; padding: 17px 0; border-bottom: 1px solid #edf0f1; }.activity-icon { width: 34px; height: 34px; display: grid; place-items: center; background: #f7efe2; color: #a77e42; border-radius: 6px; font-weight: 800; }.activity div { flex: 1; }.activity strong, .activity small { display: block; }.activity small, td small { color: #94a0a5; font-size: 11px; margin-top: 3px; }.activity em, .status { border: 0; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; font-style: normal; background: none; }.published, .active { color: #278e67; }.draft, .disabled { color: #a78046; }.empty-state { display: grid; justify-items: start; gap: 7px; padding: 58px 0 18px; color: #89969a; }.empty-state span { width: 34px; height: 34px; display: grid; place-items: center; background: #f7efe2; color: #a77e42; border-radius: 50%; font-size: 20px; }.empty-state strong { color: #30464b; }.empty-state small { font-size: 12px; }.text-action { border: 0; background: none; padding: 8px 0; color: #a77e42; font-weight: 700; cursor: pointer; }
.section-actions { display: flex; justify-content: space-between; align-items: center; gap: 22px; margin-bottom: 20px; color: #829096; font-size: 13px; line-height: 1.5; }.section-actions p { margin: 0; }.primary { border: 0; background: #bd9152; color: #fff; padding: 12px 18px; border-radius: 5px; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 8px 15px rgba(189,145,82,.16); transition: transform .2s, background .2s; }.primary:hover { background: #a77e42; transform: translateY(-1px); }.table-panel { overflow: auto; }.table-caption { padding: 22px 22px 17px; display: flex; justify-content: space-between; align-items: end; gap: 20px; }.table-caption > span { color: #9aa5a8; font-size: 12px; line-height: 1.4; text-align: right; } table { width: 100%; border-collapse: collapse; text-align: left; min-width: 760px; } th { padding: 15px 22px; background: #f9fbfa; color: #88959a; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; } td { padding: 19px 22px; border-top: 1px solid #edf0f1; font-size: 13px; } tr:hover td { background: #fbfcfb; } td strong, td small { display: block; } td strong { line-height: 1.35; } select, input, textarea { border: 1px solid #dfe5e7; background: #fff; border-radius: 5px; padding: 9px 10px; color: #27353b; font: inherit; outline: none; transition: border .2s, box-shadow .2s; } input:focus, textarea:focus, select:focus { border-color: #c29a5c; box-shadow: 0 0 0 3px rgba(194,154,92,.13); } td select { border: 0; padding: 5px; }.low-stock { color: #bd6257; font-weight: 700; }.danger-link, .edit-link { border: 0; background: none; cursor: pointer; font-weight: 700; font-size: 12px; margin-right: 12px; }.danger-link { color: #bb635d; }.edit-link { color: #9c763f; }
.result-count { color: #9aa5a8; font-size: 12px; }.content-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 17px; }.content-card { overflow: hidden; background: rgba(255,255,255,.9); border: 1px solid #e3e9e6; border-radius: 9px; box-shadow: 0 14px 30px rgba(26,44,53,.05); }.content-image { height: 150px; position: relative; display: grid; place-items: center; overflow: hidden; background: linear-gradient(135deg, #eaf0ed, #dbe5e0); }.content-image img { width: 100%; height: 100%; object-fit: cover; }.content-image > span { color: #7d8d8d; font: 800 23px Manrope; }.content-image button { position: absolute; right: 10px; bottom: 10px; border: 0; border-radius: 4px; padding: 8px 10px; background: rgba(16,35,41,.88); color: #fff; cursor: pointer; font-size: 11px; opacity: 0; transform: translateY(5px); transition: opacity .2s, transform .2s; }.content-card:hover .content-image button { opacity: 1; transform: translateY(0); }.content-card-body { padding: 16px; }.content-meta { color: #af8a52; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; }.content-card h3 { margin: 9px 0 5px; color: #183038; font: 700 16px Manrope; }.content-card p { height: 38px; overflow: hidden; margin: 0; color: #89969a; font-size: 12px; line-height: 1.55; }.edit-preview { height: 145px; overflow: hidden; display: grid; place-items: center; margin-bottom: 18px; border-radius: 6px; background: #edf2ef; color: #89969a; }.edit-preview img { width: 100%; height: 100%; object-fit: cover; }
.permission-panel { display: grid; grid-template-columns: minmax(220px, 1fr) 220px minmax(280px, 1.5fr); align-items: center; gap: 24px; margin-top: 18px; padding: 22px; background: #fff; border: 1px solid #e3e9e6; border-radius: 9px; box-shadow: 0 14px 30px rgba(26,44,53,.05); }.permission-panel h2 { margin: 0; font: 700 18px Manrope; }.permission-panel p { margin: 7px 0 0; color: #89969a; font-size: 12px; line-height: 1.5; }.permission-user-select { width: 100%; }.permission-options { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }.permission-options label { display: inline-flex; align-items: center; gap: 6px; padding: 9px 11px; border: 1px solid #e2e8e5; border-radius: 5px; color: #53656a; font-size: 12px; text-transform: capitalize; cursor: pointer; }.permission-options input { accent-color: #bd9152; }.permission-options .primary { padding: 10px 13px; }
.permission-summary { border: 1px solid #e2e8e5; background: #f8faf9; color: #8d6a38; border-radius: 4px; padding: 6px 9px; cursor: pointer; font-size: 11px; }
.modal-backdrop { position: fixed; inset: 0; z-index: 20; display: grid; place-items: center; padding: 20px; background: rgba(13,25,31,.64); backdrop-filter: blur(7px); }.modal { width: min(510px, 100%); max-height: 90vh; overflow: auto; background: #fff; padding: 36px; border-radius: 9px; position: relative; box-shadow: 0 24px 80px rgba(13,25,31,.24); }.modal h2 { margin: 0 0 24px; font: 800 26px Manrope; }.modal label { display: grid; gap: 7px; color: #65747a; font-size: 12px; font-weight: 700; margin-bottom: 15px; }.modal textarea { min-height: 80px; resize: vertical; }.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }.close { position: absolute; top: 15px; right: 18px; border: 0; background: none; font-size: 25px; color: #849095; cursor: pointer; }.full { width: 100%; margin-top: 8px; }.error { padding: 13px 16px; background: #fff0ef; color: #af5751; border-radius: 5px; }.loading { color: #8b979b; padding: 60px 0; }
@media (max-width: 1100px) { .content-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 900px) { .admin-shell { grid-template-columns: 200px minmax(0, 1fr); }.sidebar { width: 200px; min-width: 200px; }.metrics { grid-template-columns: repeat(2, 1fr); }.dashboard-grid { grid-template-columns: 1fr; }.content-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.permission-panel { grid-template-columns: 1fr 1fr; }.permission-options { grid-column: 1 / -1; } }
@media (max-width: 640px) { .admin-shell { display: block; }.sidebar { width: 100%; min-width: 100%; min-height: auto; padding: 18px; }.brand { margin: 0 0 20px; }.sidebar nav { display: flex; overflow: auto; }.sidebar nav button { min-width: 116px; }.back { display: none; }.content { width: 100%; padding: 22px 18px 30px; }.topbar { min-height: 42px; margin-bottom: 16px; }.topbar-actions { width: 100%; justify-content: space-between; }.page-heading { padding-bottom: 22px; margin-bottom: 22px; }.metrics { grid-template-columns: 1fr 1fr; gap: 10px; }.metrics article { padding: 15px; }.metrics strong { font-size: 25px; }.section-actions { gap: 15px; align-items: flex-end; }.panel { padding: 20px; }.content-grid { grid-template-columns: 1fr; }.content-image button { opacity: 1; transform: none; }.permission-panel { grid-template-columns: 1fr; }.permission-options { grid-column: auto; }.table-caption { align-items: flex-start; gap: 8px; flex-direction: column; }.table-caption > span { text-align: left; } }
</style>
