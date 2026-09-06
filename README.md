# ZENKRIO

ZENKRIO 是一个面向卫浴产品展示与项目管理的 Vue 3 网站，包含产品系列浏览、用户注册登录、邮箱验证码、联系表单和管理员后台。

## 功能

- 首页品牌展示、产品集合、产品分类和系列入口
- 产品系列与产品详情页
- 用户注册、登录和邮箱验证码验证
- Contact Form：将访客留言发送到 SMTP 配置中的接收邮箱
- 管理员后台：访问统计、用户管理、权限管理和产品目录管理
- SQL Server 持久化用户、产品和访问记录
- 自制卫浴主题产品视觉资源，支持桌面端和移动端布局

## 技术栈

- Vue 3 + Vue Router
- Vite
- Express 5
- Microsoft SQL Server
- `mssql`、`nodemailer`、`jsonwebtoken`、`axios`

## 环境要求

- Node.js 18 或更高版本
- npm
- Microsoft SQL Server
- 可用的 SMTP 邮箱服务

## 安装

```powershell
npm install
Copy-Item .env.example .env
```

然后编辑 `.env`，至少配置 SQL Server 和 SMTP 参数。不要把 `.env` 提交到 GitHub。

## 数据库初始化

1. 使用 SQL Server Management Studio 打开 `sqlserver/schema.sql`。
2. 在目标 SQL Server 实例执行脚本。
3. 在 `.env` 中填写 `SQL_SERVER`、`SQL_PORT`、`SQL_DATABASE`、`SQL_USER` 和 `SQL_PASSWORD`。
4. 需要使用命名实例时，建议为 SQL Server 配置固定 TCP 端口。

脚本会创建或更新以下表：

- `dbo.Users`
- `dbo.Products`
- `dbo.VisitLogs`

## 邮箱配置

验证码和 Contact Form 共用同一套 SMTP 配置：

```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-mail@qq.com
SMTP_PASSWORD=mail-provider-app-password
SMTP_FROM=your-mail@qq.com
```

- `SMTP_USER`：验证码和联系表单信息的接收邮箱
- `SMTP_FROM`：邮件发件人，通常使用同一个邮箱
- QQ、163 等邮箱通常需要使用授权码，不要填写网页登录密码
- Contact Form 的访客邮箱会被设置为 `replyTo`，收到邮件后可以直接回复访客

没有 SMTP 配置时，开发环境的验证码接口会返回临时 `devCode`；生产环境会拒绝发送邮件。Contact Form 必须配置 SMTP 才能发送。

## 启动项目

### 启动后端 API

```powershell
npm run server
```

后端默认运行在 `http://localhost:4000`。健康检查：

```powershell
Invoke-RestMethod http://localhost:4000/health
```

数据库连接成功时，响应中的 `database` 为 `connected`。

### 启动前端开发服务器

另开一个终端执行：

```powershell
npm run dev
```

前端默认运行在 `http://localhost:5173`。如果 API 地址不同，请修改 `.env` 中的 `VITE_API_BASE` 并重启前端。

## 管理员账号

1. 先注册一个普通账号。
2. 在 SSMS 中执行：

```sql
USE [ZenkRioCom];
UPDATE dbo.Users
SET Role = N'admin'
WHERE Username = N'your-username';
```

3. 重新登录后访问 `http://localhost:5173/admin`。

管理员后台支持：

- 七日访问趋势和访问总量
- 用户创建、删除、启用/禁用和角色管理
- 模块权限管理
- 产品创建、编辑、删除
- 产品价格、库存、分类、描述和发布状态管理

## 生产构建

```powershell
npm run build
npm run preview
```

构建文件输出到 `dist/`。部署到 Netlify 等静态托管平台时，需要将前端 API 部署到可访问的后端地址，并将 `VITE_API_BASE` 设置为该地址。

## 常用 API

- `GET /health`：服务和数据库状态
- `POST /api/auth/send-code`：发送邮箱验证码
- `POST /api/auth/register`：注册账号
- `POST /api/auth/login`：用户登录
- `POST /api/contact`：发送 Contact Form 留言
- `POST /api/analytics/visit`：记录访问
- `/api/admin/*`：管理员功能，需要管理员 JWT

## 安全注意事项

- 生产环境必须修改 `JWT_SECRET` 和 SQL Server 密码。
- 不要提交 `.env`、SMTP 密码或数据库密码。
- 生产环境建议使用 HTTPS，并限制 CORS 来源。
- 修改数据库结构前请先备份。
- 验证码目前保存在 API 进程内存中，服务重启后会失效。
