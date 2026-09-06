import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import sql from 'mssql'
import crypto from 'node:crypto'
import nodemailer from 'nodemailer'

const app = express()
const PORT = Number(process.env.PORT) || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'zenkriocom-dev-secret'
const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)
const mailer = smtpConfigured ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
}) : null
const sqlConfig = {
  server: process.env.SQL_SERVER || 'localhost',
  port: Number(process.env.SQL_PORT) || 1433,
  database: process.env.SQL_DATABASE || 'ZenkRioCom',
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  options: {
    encrypt: String(process.env.SQL_ENCRYPT || 'false').toLowerCase() === 'true',
    trustServerCertificate: String(process.env.SQL_TRUST_SERVER_CERT || 'true').toLowerCase() === 'true',
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
}

app.use(cors())
app.use(express.json())

const verificationCodes = new Map()
let dbPool

function normalize(value) {
  return String(value || '').trim()
}

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value))
}

function productInput(body) {
  const name = normalize(body.name)
  const category = normalize(body.category)
  const price = Number(body.price)
  const stock = Number(body.stock)
  if (!name || name.length > 160) return { error: 'Product name is required and must be 160 characters or less' }
  if (!category || category.length > 120) return { error: 'Product category is required and must be 120 characters or less' }
  if (!Number.isFinite(price) || price < 0) return { error: 'Price must be a non-negative number' }
  if (!Number.isInteger(stock) || stock < 0) return { error: 'Stock must be a non-negative integer' }
  return {
    name,
    series: normalize(body.series) || null,
    category,
    description: normalize(body.description) || null,
    imageUrl: normalize(body.imageUrl) || null,
    price,
    stock,
    status: body.status === 'published' ? 'published' : 'draft',
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedValue) {
  const [salt, storedHash] = String(storedValue || '').split(':')
  if (!salt || !storedHash) return false
  const calculatedHash = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(calculatedHash, 'hex'), Buffer.from(storedHash, 'hex'))
}

async function getDb() {
  if (!dbPool) dbPool = await sql.connect(sqlConfig)
  return dbPool
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function storeCode(key, code, ttlMs = 5 * 60 * 1000) {
  verificationCodes.set(key, { code, expiresAt: Date.now() + ttlMs })
}

function validateCode(key, value) {
  const item = verificationCodes.get(key)
  if (!item) return false
  if (Date.now() > item.expiresAt) {
    verificationCodes.delete(key)
    return false
  }
  const ok = String(value) === String(item.code)
  if (ok) verificationCodes.delete(key)
  return ok
}

async function deliverEmailCode(email, code) {
  if (!mailer) {
    if (process.env.NODE_ENV === 'production') throw new Error('Email service is not configured')
    return false
  }
  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Your ZENKRIO verification code',
    text: `Your verification code is ${code}. It expires in 5 minutes.`,
    html: `<p>Your ZENKRIO verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>This code expires in 5 minutes.</p>`,
  })
  return true
}

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role || 'user',
      permissions: user.permissions || [],
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function readToken(req) {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7) : ''
}

function requireAuth(req, res, next) {
  try {
    req.user = jwt.verify(readToken(req), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Authentication required' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Administrator access required' })
  next()
}

function requireModule(moduleName) {
  return (req, res, next) => {
    const permissions = req.user?.permissions?.length
      ? req.user.permissions
      : req.user?.role === 'admin' ? ['overview', 'products', 'users', 'content'] : []
    if (req.user?.role !== 'admin' || permissions.includes(moduleName)) return next()
    res.status(403).json({ message: `No permission for ${moduleName} module` })
  }
}

function userDto(row) {
  let permissions = []
  try { permissions = row.Permissions ? JSON.parse(row.Permissions) : [] } catch {}
  return {
    id: row.Id,
    username: row.Username,
    email: row.Email,
    phone: row.Phone,
    role: row.Role,
    status: row.Status,
    permissions,
    createdAt: row.CreatedAt,
  }
}

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'zenkriocom-auth', database: dbPool?.connected ? 'connected' : 'not-connected' })
})

app.post('/api/auth/register', async (req, res) => {
  const username = normalize(req.body.username)
  const password = normalize(req.body.password)
  const email = normalize(req.body.email)
  const phone = normalize(req.body.phone)
  const verificationCode = normalize(req.body.verificationCode)
  const verificationType = 'email'
  const verificationValue = email

  if (!username || !password || password.length < 8 || !email || !verificationCode) {
    return res.status(400).json({ message: 'Username, password, email and verification code are required' })
  }
  if (!validateCode(`${verificationType}:${verificationValue}`, verificationCode)) {
    return res.status(400).json({ message: 'Invalid or expired verification code' })
  }

  try {
    const pool = await getDb()
    await pool.request()
      .input('username', sql.NVarChar(100), username)
      .input('email', sql.NVarChar(255), email || null)
      .input('phone', sql.NVarChar(30), phone || null)
      .input('passwordHash', sql.NVarChar(255), hashPassword(password))
      .query(`INSERT INTO dbo.Users (Username, PasswordHash, Email, Phone)
              VALUES (@username, @passwordHash, @email, @phone)`)

    return res.status(201).json({ success: true, message: 'Registered successfully', user: { username, email, phone, role: 'user', permissions: [] } })
  } catch (error) {
    if (error.number === 2601 || error.number === 2627) {
      return res.status(409).json({ message: 'Username, email or phone already exists' })
    }
    console.error('SQL Server register error:', error.message)
    return res.status(500).json({ message: 'Database connection failed' })
  }
})

app.post('/api/auth/send-code', async (req, res) => {
  const type = normalize(req.body.type)
  const value = normalize(req.body.value)

  if (type !== 'email' || !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return res.status(400).json({ message: 'Type and value are required' })
  }

  const key = `${type}:${value}`
  const code = generateCode()
  storeCode(key, code)
  try {
    const delivered = await deliverEmailCode(value, code)
    if (!delivered) console.log(`[development email code] ${value}: ${code}`)
  } catch (error) {
    verificationCodes.delete(key)
    return res.status(503).json({ message: error.message || 'Email service is unavailable' })
  }

  const response = {
    success: true,
    message: 'Verification code sent',
    expiresIn: 300
  }
  if (process.env.NODE_ENV !== 'production') response.devCode = code
  return res.json(response)
})

app.post('/api/auth/login', async (req, res) => {
  const identifier = normalize(req.body.identifier)
  const password = normalize(req.body.password)

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required' })
  }

  try {
    const pool = await getDb()
    const result = await pool.request()
      .input('identifier', sql.NVarChar(255), identifier)
      .query(`SELECT TOP 1 Id, Username, PasswordHash, Email, Phone, Role, Status, Permissions
              FROM dbo.Users
              WHERE Username = @identifier OR Email = @identifier OR Phone = @identifier`)
    const user = result.recordset[0]
    if (!user) return res.status(401).json({ message: 'Invalid username or password' })
    if (user.Status !== 'active') return res.status(403).json({ message: 'This account is disabled' })

    const isPasswordMatch = verifyPassword(password, user.PasswordHash)
    const isCodeMatch = (user.Phone === identifier && validateCode(`phone:${user.Phone}`, password)) ||
      (user.Email === identifier && validateCode(`email:${user.Email}`, password))
    if (!isPasswordMatch && !isCodeMatch) return res.status(401).json({ message: 'Invalid username or password' })

    const permissions = user.Role === 'admin' && !user.Permissions ? ['overview', 'products', 'users', 'content'] : (() => { try { return JSON.parse(user.Permissions || '[]') } catch { return [] } })()
    const tokenUser = { id: user.Id, username: user.Username, email: user.Email, phone: user.Phone, role: user.Role, permissions }
    return res.json({ success: true, token: issueToken(tokenUser), user: tokenUser })
  } catch (error) {
    console.error('SQL Server login error:', error.message)
    return res.status(500).json({ message: 'Database connection failed' })
  }
})

app.post('/api/analytics/visit', async (req, res) => {
  try {
    const pool = await getDb()
    await pool.request()
      .input('path', sql.NVarChar(300), normalize(req.body.path) || '/')
      .input('ipAddress', sql.NVarChar(64), req.headers['x-forwarded-for'] || req.socket.remoteAddress || null)
      .input('userAgent', sql.NVarChar(500), req.headers['user-agent'] || null)
      .query(`INSERT INTO dbo.VisitLogs (Path, IpAddress, UserAgent) VALUES (@path, @ipAddress, @userAgent)`)
    res.status(201).json({ success: true })
  } catch (error) {
    console.error('Visit log error:', error.message)
    res.status(500).json({ message: 'Unable to record visit' })
  }
})

app.get('/api/products', async (_, res) => {
  try {
    const pool = await getDb()
    const result = await pool.request().query(`
      SELECT Id AS id, Name AS name, Series AS series, Category AS category,
             Description AS description, ImageUrl AS imageUrl, Price AS price,
             Stock AS stock, Status AS status, CreatedAt AS createdAt, UpdatedAt AS updatedAt
      FROM dbo.Products WHERE Status = 'published' ORDER BY UpdatedAt DESC
    `)
    res.json(result.recordset)
  } catch (error) {
    console.error('Product list error:', error.message)
    res.status(500).json({ message: 'Database connection failed' })
  }
})

app.get('/api/content', async (_, res) => {
  try {
    const pool = await getDb()
    const result = await pool.request().query(`
      SELECT Id AS id, ContentType AS contentType, ContentKey AS contentKey, Title AS title,
        Subtitle AS subtitle, Body AS body, ImageUrl AS imageUrl, SortOrder AS sortOrder
      FROM dbo.SiteContents WHERE Status = 'published' ORDER BY SortOrder, Id
    `)
    res.json(result.recordset)
  } catch (error) {
    console.error('Site content error:', error.message)
    res.status(500).json({ message: 'Database connection failed' })
  }
})

app.use('/api/admin', requireAuth, requireAdmin)

app.get('/api/admin/overview', requireModule('overview'), async (_, res) => {
  try {
    const pool = await getDb()
    const [summary, visits, products] = await Promise.all([
      pool.request().query(`
        SELECT
          (SELECT COUNT(*) FROM dbo.Users) AS userCount,
          (SELECT COUNT(*) FROM dbo.Products WHERE Status = 'published') AS publishedProducts,
          (SELECT COUNT(*) FROM dbo.Products WHERE Status = 'draft') AS draftProducts,
          (SELECT COUNT(*) FROM dbo.VisitLogs) AS visitCount
      `),
      pool.request().query(`
        SELECT CONVERT(varchar(10), VisitedAt, 23) AS date, COUNT(*) AS count
        FROM dbo.VisitLogs WHERE VisitedAt >= DATEADD(day, -6, SYSUTCDATETIME())
        GROUP BY CONVERT(varchar(10), VisitedAt, 23) ORDER BY date
      `),
      pool.request().query(`
        SELECT TOP 5 Id AS id, Name AS name, Category AS category, Status AS status, Stock AS stock, UpdatedAt AS updatedAt
        FROM dbo.Products ORDER BY UpdatedAt DESC
      `),
    ])
    res.json({ summary: summary.recordset[0], visits: visits.recordset, recentProducts: products.recordset })
  } catch (error) {
    console.error('Admin overview error:', error.message)
    res.status(500).json({ message: 'Database connection failed' })
  }
})

app.get('/api/admin/users', requireModule('users'), async (_, res) => {
  try {
    const pool = await getDb()
    const result = await pool.request().query(`
      SELECT Id, Username, Email, Phone, Role, Status, Permissions, CreatedAt
      FROM dbo.Users ORDER BY CreatedAt DESC
    `)
    res.json(result.recordset.map(userDto))
  } catch (error) {
    console.error('Admin users error:', error.message)
    res.status(500).json({ message: 'Database connection failed' })
  }
})

app.post('/api/admin/users', requireModule('users'), async (req, res) => {
  const username = normalize(req.body.username)
  const password = normalize(req.body.password)
  const email = normalize(req.body.email)
  const phone = normalize(req.body.phone)
  const role = req.body.role === 'admin' ? 'admin' : 'user'
  if (!username || !password || password.length < 8) return res.status(400).json({ message: 'Username and password are required; password must be at least 8 characters' })
  try {
    const pool = await getDb()
    const result = await pool.request()
      .input('username', sql.NVarChar(100), username)
      .input('email', sql.NVarChar(255), email || null)
      .input('phone', sql.NVarChar(30), phone || null)
      .input('passwordHash', sql.NVarChar(255), hashPassword(password))
      .input('role', sql.NVarChar(20), role)
      .input('permissions', sql.NVarChar(500), role === 'admin' ? JSON.stringify(req.body.permissions || ['overview', 'products', 'users', 'content']) : '[]')
      .query(`
        INSERT INTO dbo.Users (Username, PasswordHash, Email, Phone, Role, Permissions)
        OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Email, INSERTED.Phone, INSERTED.Role, INSERTED.Status, INSERTED.Permissions, INSERTED.CreatedAt
        VALUES (@username, @passwordHash, @email, @phone, @role, @permissions)
      `)
    res.status(201).json(userDto(result.recordset[0]))
  } catch (error) {
    if (error.number === 2601 || error.number === 2627) return res.status(409).json({ message: 'Username, email or phone already exists' })
    console.error('Admin create user error:', error.message)
    res.status(500).json({ message: 'Database connection failed' })
  }
})

app.patch('/api/admin/users/:id', requireModule('users'), async (req, res) => {
  if (!isValidUuid(req.params.id)) return res.status(400).json({ message: 'Invalid user id' })
  try {
    const pool = await getDb()
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('email', sql.NVarChar(255), normalize(req.body.email) || null)
      .input('phone', sql.NVarChar(30), normalize(req.body.phone) || null)
      .input('role', sql.NVarChar(20), req.body.role === 'admin' ? 'admin' : 'user')
      .input('status', sql.NVarChar(20), req.body.status === 'disabled' ? 'disabled' : 'active')
      .input('permissions', sql.NVarChar(500), req.body.role === 'admin' ? JSON.stringify(req.body.permissions || []) : '[]')
      .query(`
        UPDATE dbo.Users SET Email=@email, Phone=@phone, Role=@role, Status=@status, Permissions=@permissions, UpdatedAt=SYSUTCDATETIME()
        OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Email, INSERTED.Phone, INSERTED.Role, INSERTED.Status, INSERTED.Permissions, INSERTED.CreatedAt
        WHERE Id=@id
      `)
    if (!result.recordset[0]) return res.status(404).json({ message: 'User not found' })
    res.json(userDto(result.recordset[0]))
  } catch (error) {
    res.status(500).json({ message: 'Unable to update user' })
  }
})

app.delete('/api/admin/users/:id', requireModule('users'), async (req, res) => {
  if (!isValidUuid(req.params.id)) return res.status(400).json({ message: 'Invalid user id' })
  try {
    const pool = await getDb()
    const target = await pool.request().input('id', sql.UniqueIdentifier, req.params.id).query('SELECT Role FROM dbo.Users WHERE Id=@id')
    if (!target.recordset[0]) return res.status(404).json({ message: 'User not found' })
    if (String(target.recordset[0].Role).toLowerCase() === 'admin') {
      const admins = await pool.request().query("SELECT COUNT(*) AS count FROM dbo.Users WHERE Role='admin' AND Status='active'")
      if (admins.recordset[0].count <= 1) return res.status(409).json({ message: 'The last active administrator cannot be deleted' })
    }
    await pool.request().input('id', sql.UniqueIdentifier, req.params.id).query('DELETE FROM dbo.Users WHERE Id=@id')
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete user' })
  }
})

app.get('/api/admin/products', requireModule('products'), async (_, res) => {
  try {
    const pool = await getDb()
    const result = await pool.request().query(`
      SELECT Id AS id, Name AS name, Series AS series, Category AS category, Description AS description,
             ImageUrl AS imageUrl, Price AS price, Stock AS stock, Status AS status, CreatedAt AS createdAt, UpdatedAt AS updatedAt
      FROM dbo.Products ORDER BY UpdatedAt DESC
    `)
    res.json(result.recordset)
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' })
  }
})

app.get('/api/admin/content', requireModule('content'), async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 20)
  try {
    const pool = await getDb()
    const result = await pool.request().input('limit', sql.Int, limit).query(`
      SELECT TOP (@limit) Id AS id, ContentType AS contentType, ContentKey AS contentKey,
        Title AS title, Subtitle AS subtitle, Body AS body, ImageUrl AS imageUrl,
        SortOrder AS sortOrder, Status AS status, UpdatedAt AS updatedAt
      FROM dbo.SiteContents ORDER BY SortOrder, Id
    `)
    res.json(result.recordset)
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' })
  }
})

app.patch('/api/admin/content/:id', requireModule('content'), async (req, res) => {
  if (!Number.isInteger(Number(req.params.id)) || Number(req.params.id) < 1) return res.status(400).json({ message: 'Invalid content id' })
  const title = normalize(req.body.title)
  const subtitle = normalize(req.body.subtitle)
  const body = normalize(req.body.body)
  const imageUrl = normalize(req.body.imageUrl)
  if (!title && !subtitle && !body && !imageUrl) return res.status(400).json({ message: 'Content cannot be empty' })
  try {
    const pool = await getDb()
    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .input('title', sql.NVarChar(200), title || null)
      .input('subtitle', sql.NVarChar(300), subtitle || null)
      .input('body', sql.NVarChar(sql.MAX), body || null)
      .input('imageUrl', sql.NVarChar(500), imageUrl || null)
      .query(`
        UPDATE dbo.SiteContents SET Title=@title, Subtitle=@subtitle, Body=@body,
          ImageUrl=@imageUrl, UpdatedAt=SYSUTCDATETIME()
        OUTPUT INSERTED.Id AS id, INSERTED.ContentType AS contentType, INSERTED.ContentKey AS contentKey,
          INSERTED.Title AS title, INSERTED.Subtitle AS subtitle, INSERTED.Body AS body,
          INSERTED.ImageUrl AS imageUrl, INSERTED.SortOrder AS sortOrder, INSERTED.Status AS status,
          INSERTED.UpdatedAt AS updatedAt
        WHERE Id=@id
      `)
    if (!result.recordset[0]) return res.status(404).json({ message: 'Content not found' })
    res.json(result.recordset[0])
  } catch (error) {
    res.status(500).json({ message: 'Unable to update content' })
  }
})

app.post('/api/admin/products', requireModule('products'), async (req, res) => {
  const input = productInput(req.body)
  if (input.error) return res.status(400).json({ message: input.error })
  try {
    const pool = await getDb()
    const result = await pool.request()
      .input('name', sql.NVarChar(160), input.name).input('series', sql.NVarChar(100), input.series)
      .input('category', sql.NVarChar(120), input.category).input('description', sql.NVarChar(1000), input.description)
      .input('imageUrl', sql.NVarChar(500), input.imageUrl).input('price', sql.Decimal(18, 2), input.price)
      .input('stock', sql.Int, input.stock).input('status', sql.NVarChar(20), input.status)
      .query(`
        INSERT INTO dbo.Products (Name, Series, Category, Description, ImageUrl, Price, Stock, Status)
        OUTPUT INSERTED.Id AS id, INSERTED.Name AS name, INSERTED.Series AS series, INSERTED.Category AS category,
               INSERTED.Description AS description, INSERTED.ImageUrl AS imageUrl, INSERTED.Price AS price,
               INSERTED.Stock AS stock, INSERTED.Status AS status, INSERTED.CreatedAt AS createdAt, INSERTED.UpdatedAt AS updatedAt
        VALUES (@name, @series, @category, @description, @imageUrl, @price, @stock, @status)
      `)
    res.status(201).json(result.recordset[0])
  } catch (error) {
    res.status(500).json({ message: 'Unable to create product' })
  }
})

app.patch('/api/admin/products/:id', requireModule('products'), async (req, res) => {
  if (!Number.isInteger(Number(req.params.id)) || Number(req.params.id) < 1) return res.status(400).json({ message: 'Invalid product id' })
  const input = productInput(req.body)
  if (input.error) return res.status(400).json({ message: input.error })
  try {
    const pool = await getDb()
    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .input('name', sql.NVarChar(160), input.name).input('series', sql.NVarChar(100), input.series)
      .input('category', sql.NVarChar(120), input.category).input('description', sql.NVarChar(1000), input.description)
      .input('imageUrl', sql.NVarChar(500), input.imageUrl).input('price', sql.Decimal(18, 2), input.price)
      .input('stock', sql.Int, input.stock).input('status', sql.NVarChar(20), input.status)
      .query(`
        UPDATE dbo.Products SET Name=@name, Series=@series, Category=@category, Description=@description,
          ImageUrl=@imageUrl, Price=@price, Stock=@stock, Status=@status, UpdatedAt=SYSUTCDATETIME()
        OUTPUT INSERTED.Id AS id, INSERTED.Name AS name, INSERTED.Series AS series, INSERTED.Category AS category,
          INSERTED.Description AS description, INSERTED.ImageUrl AS imageUrl, INSERTED.Price AS price,
          INSERTED.Stock AS stock, INSERTED.Status AS status, INSERTED.CreatedAt AS createdAt, INSERTED.UpdatedAt AS updatedAt
        WHERE Id=@id
      `)
    if (!result.recordset[0]) return res.status(404).json({ message: 'Product not found' })
    res.json(result.recordset[0])
  } catch (error) {
    res.status(500).json({ message: 'Unable to update product' })
  }
})

app.delete('/api/admin/products/:id', requireModule('products'), async (req, res) => {
  if (!Number.isInteger(Number(req.params.id)) || Number(req.params.id) < 1) return res.status(400).json({ message: 'Invalid product id' })
  try {
    const pool = await getDb()
    await pool.request().input('id', sql.Int, Number(req.params.id)).query('DELETE FROM dbo.Products WHERE Id=@id')
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete product' })
  }
})

async function start() {
  try {
    await getDb()
    console.log(`SQL Server connected: ${sqlConfig.server}/${sqlConfig.database}`)
    app.listen(PORT, () => console.log(`Auth API running at http://localhost:${PORT}`))
  } catch (error) {
    console.error('Unable to connect to SQL Server:', error.message)
    process.exitCode = 1
  }
}

start()
