# SQL Server setup

1. Open SQL Server Management Studio (SSMS).
2. Open `sqlserver/schema.sql` and execute it against the SQL Server instance.
3. Copy the SQL settings from `.env.example` into `.env`.
4. Replace `SQL_PASSWORD` with the password of the SQL Server login.
5. Start the API from PowerShell:

```powershell
Set-Location 'D:\dev\zenkriocom'
npm run server
```

The API starts only after SQL Server connects successfully. Check:

```powershell
Invoke-RestMethod http://localhost:4000/health
```

A successful response contains `ok: true` and `database: "connected"`.

## Authentication mode

- Users are stored in `ZenkRioCom.dbo.Users`.
- Passwords are stored as scrypt hashes, never as plain text.
- Verification codes remain in server memory and expire after five minutes.
- `SQL_SERVER` can be an instance host or IP address. For a named instance, prefer configuring a fixed TCP port and set `SQL_PORT` accordingly.
- Registration verification is email-only. The phone field is optional profile information.

## Email verification

Copy the SMTP settings from `.env.example` into `.env`. For common providers:

- QQ Mail: `SMTP_HOST=smtp.qq.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`; use the mailbox authorization code as `SMTP_PASSWORD`.
- 163 Mail: `SMTP_HOST=smtp.163.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`; use the mailbox authorization code as `SMTP_PASSWORD`.
- Gmail: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`; use a Google app password.

Example:

```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-qq-mail@qq.com
SMTP_PASSWORD=your-mail-provider-app-password
SMTP_FROM=your-qq-mail@qq.com
```

After restarting `npm run server`, registration sends a real email. Without SMTP settings, development mode returns a temporary `devCode` for local testing; production mode refuses to send and reports that the email service is not configured.

## Admin dashboard

After registering the first account, promote it to administrator in SSMS:

```sql
USE [zenkriocom];
UPDATE dbo.Users SET Role = N'admin' WHERE Username = N'your-username';
```

Then log in again and open `http://localhost:5173/admin`.

The dashboard provides:

- visit totals and a seven-day traffic chart
- user creation, deletion, role and active/disabled status changes
- product creation, editing, deletion, draft and published status
- product price, stock, category and description management

The script creates `dbo.Users`, `dbo.Products`, and `dbo.VisitLogs`. Re-running it is safe for these tables and adds missing user columns, but keep a database backup before applying schema changes in production.
