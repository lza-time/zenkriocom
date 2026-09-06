import 'dotenv/config'
import sql from 'mssql'

const pool = await sql.connect({
  server: process.env.SQL_SERVER,
  port: Number(process.env.SQL_PORT),
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.SQL_TRUST_SERVER_CERT === 'true',
  },
})

const column = await pool.request().query(`SELECT COL_LENGTH(N'dbo.Users', N'Permissions') AS length`)
if (column.recordset[0].length === null) {
  await pool.request().query('ALTER TABLE dbo.Users ADD Permissions NVARCHAR(500) NULL')
}
await pool.request().query(`
  UPDATE dbo.Users SET Permissions = N'["overview","products","users","content"]'
  WHERE Role = N'admin' AND (Permissions IS NULL OR Permissions = N'')
`)

console.log('User permissions migration complete')
await pool.close()
