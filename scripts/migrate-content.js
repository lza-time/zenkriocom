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

await pool.request().query(`
  IF OBJECT_ID(N'dbo.SiteContents', N'U') IS NULL
  BEGIN
    CREATE TABLE dbo.SiteContents (
      Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SiteContents PRIMARY KEY,
      ContentType NVARCHAR(30) NOT NULL,
      ContentKey NVARCHAR(100) NOT NULL,
      Title NVARCHAR(200) NULL,
      Subtitle NVARCHAR(300) NULL,
      Body NVARCHAR(MAX) NULL,
      ImageUrl NVARCHAR(500) NULL,
      SortOrder INT NOT NULL CONSTRAINT DF_SiteContents_SortOrder DEFAULT 0,
      Status NVARCHAR(20) NOT NULL CONSTRAINT DF_SiteContents_Status DEFAULT N'published',
      UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_SiteContents_UpdatedAt DEFAULT SYSUTCDATETIME()
    )
  END
  IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name=N'UX_SiteContents_Key' AND object_id=OBJECT_ID(N'dbo.SiteContents'))
    CREATE UNIQUE INDEX UX_SiteContents_Key ON dbo.SiteContents(ContentType, ContentKey)
`)

const rows = [
  ['stat', 'experience', '18+', 'Years of Experience', null, null, 1],
  ['stat', 'projects', '2,600+', 'Completed Projects', null, null, 2],
  ['stat', 'countries', '46', 'Export Countries', null, null, 3],
  ['stat', 'skus', '360+', 'Product SKUs', null, null, 4],
  ['product', 'aurora', 'AURORA Series', 'Freestanding Bathtub', 'Solid surface integrated molding, streamline design, constant temperature insulation technology', '/src/assets/1.png', 10],
  ['product', 'vessel', 'VESSEL Series', 'Countertop Basin', 'Ultra-thin edge, nano self-cleaning glaze, antibacterial ceramic technology', '/src/assets/hero.png', 11],
  ['product', 'nexus', 'NEXUS Series', 'Smart Toilet', 'Instant heating system, auto lid sensor, UV sterilization & deodorization', '/src/assets/1.png', 12],
  ['product', 'modular', 'MODULAR Series', 'Bathroom Cabinet', 'Modular design, moisture-proof multilayer wood, soft close hinge technology', '/src/assets/hero.png', 13],
]

for (const [type, key, title, subtitle, body, image, sort] of rows) {
  await pool.request()
    .input('type', sql.NVarChar(30), type)
    .input('key', sql.NVarChar(100), key)
    .input('title', sql.NVarChar(200), title)
    .input('subtitle', sql.NVarChar(300), subtitle)
    .input('body', sql.NVarChar(sql.MAX), body)
    .input('image', sql.NVarChar(500), image)
    .input('sort', sql.Int, sort)
    .query(`
      IF NOT EXISTS (SELECT 1 FROM dbo.SiteContents WHERE ContentType=@type AND ContentKey=@key)
        INSERT INTO dbo.SiteContents(ContentType, ContentKey, Title, Subtitle, Body, ImageUrl, SortOrder)
        VALUES (@type, @key, @title, @subtitle, @body, @image, @sort)
    `)
}

console.log('SiteContents migration complete')
await pool.close()
