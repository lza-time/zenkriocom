USE [master]
GO

/****** Object:  Database [zenkriocom]    Script Date: 2026/9/6 16:23:41 ******/
CREATE DATABASE [zenkriocom]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'zenkriocom', FILENAME = N'E:\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\zenkriocom.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'zenkriocom_log', FILENAME = N'E:\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\zenkriocom_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [zenkriocom].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [zenkriocom] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [zenkriocom] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [zenkriocom] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [zenkriocom] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [zenkriocom] SET ARITHABORT OFF 
GO

ALTER DATABASE [zenkriocom] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [zenkriocom] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [zenkriocom] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [zenkriocom] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [zenkriocom] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [zenkriocom] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [zenkriocom] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [zenkriocom] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [zenkriocom] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [zenkriocom] SET  DISABLE_BROKER 
GO

ALTER DATABASE [zenkriocom] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [zenkriocom] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [zenkriocom] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [zenkriocom] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [zenkriocom] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [zenkriocom] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [zenkriocom] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [zenkriocom] SET RECOVERY SIMPLE 
GO

ALTER DATABASE [zenkriocom] SET  MULTI_USER 
GO

ALTER DATABASE [zenkriocom] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [zenkriocom] SET DB_CHAINING OFF 
GO

ALTER DATABASE [zenkriocom] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [zenkriocom] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [zenkriocom] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [zenkriocom] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO

ALTER DATABASE [zenkriocom] SET QUERY_STORE = ON
GO

ALTER DATABASE [zenkriocom] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO

ALTER DATABASE [zenkriocom] SET  READ_WRITE 
GO

USE [zenkriocom]
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
	CREATE TABLE dbo.Users (
		Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Users PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
		Username NVARCHAR(100) NOT NULL,
		PasswordHash NVARCHAR(255) NOT NULL,
		Email NVARCHAR(255) NULL,
		Phone NVARCHAR(30) NULL,
		Role NVARCHAR(20) NOT NULL CONSTRAINT DF_Users_Role DEFAULT N'user',
		Status NVARCHAR(20) NOT NULL CONSTRAINT DF_Users_Status DEFAULT N'active',
		CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
		UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT SYSUTCDATETIME()
	)
END
GO

IF COL_LENGTH(N'dbo.Users', N'Role') IS NULL
	ALTER TABLE dbo.Users ADD Role NVARCHAR(20) NOT NULL CONSTRAINT DF_Users_Role DEFAULT N'user'
GO
IF COL_LENGTH(N'dbo.Users', N'Status') IS NULL
	ALTER TABLE dbo.Users ADD Status NVARCHAR(20) NOT NULL CONSTRAINT DF_Users_Status DEFAULT N'active'
GO
IF COL_LENGTH(N'dbo.Users', N'CreatedAt') IS NULL
	ALTER TABLE dbo.Users ADD CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME()
GO
IF COL_LENGTH(N'dbo.Users', N'UpdatedAt') IS NULL
	ALTER TABLE dbo.Users ADD UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT SYSUTCDATETIME()
GO
IF COL_LENGTH(N'dbo.Users', N'Permissions') IS NULL
	ALTER TABLE dbo.Users ADD Permissions NVARCHAR(500) NULL
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Users_Username' AND object_id = OBJECT_ID(N'dbo.Users'))
	CREATE UNIQUE INDEX UX_Users_Username ON dbo.Users(Username)
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Users_Email' AND object_id = OBJECT_ID(N'dbo.Users'))
	CREATE UNIQUE INDEX UX_Users_Email ON dbo.Users(Email) WHERE Email IS NOT NULL
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Users_Phone' AND object_id = OBJECT_ID(N'dbo.Users'))
	CREATE UNIQUE INDEX UX_Users_Phone ON dbo.Users(Phone) WHERE Phone IS NOT NULL
GO

IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
BEGIN
	CREATE TABLE dbo.Products (
		Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Products PRIMARY KEY,
		Name NVARCHAR(160) NOT NULL,
		Series NVARCHAR(100) NULL,
		Category NVARCHAR(120) NOT NULL,
		Description NVARCHAR(1000) NULL,
		ImageUrl NVARCHAR(500) NULL,
		Price DECIMAL(18,2) NOT NULL CONSTRAINT DF_Products_Price DEFAULT 0,
		Stock INT NOT NULL CONSTRAINT DF_Products_Stock DEFAULT 0,
		Status NVARCHAR(20) NOT NULL CONSTRAINT DF_Products_Status DEFAULT N'draft',
		CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT SYSUTCDATETIME(),
		UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Products_UpdatedAt DEFAULT SYSUTCDATETIME()
	)
END
GO

IF OBJECT_ID(N'dbo.VisitLogs', N'U') IS NULL
BEGIN
	CREATE TABLE dbo.VisitLogs (
		Id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_VisitLogs PRIMARY KEY,
		Path NVARCHAR(300) NOT NULL,
		IpAddress NVARCHAR(64) NULL,
		UserAgent NVARCHAR(500) NULL,
		UserId UNIQUEIDENTIFIER NULL,
		VisitedAt DATETIME2(0) NOT NULL CONSTRAINT DF_VisitLogs_VisitedAt DEFAULT SYSUTCDATETIME(),
		CONSTRAINT FK_VisitLogs_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE SET NULL
	)
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_VisitLogs_VisitedAt' AND object_id = OBJECT_ID(N'dbo.VisitLogs'))
	CREATE INDEX IX_VisitLogs_VisitedAt ON dbo.VisitLogs(VisitedAt)
GO

SELECT N'Admin tables are ready' AS Result
GO

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
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_SiteContents_Key' AND object_id = OBJECT_ID(N'dbo.SiteContents'))
	CREATE UNIQUE INDEX UX_SiteContents_Key ON dbo.SiteContents(ContentType, ContentKey)
GO

MERGE dbo.SiteContents AS target
USING (VALUES
	(N'stat', N'experience', N'18+', N'Years of Experience', NULL, NULL, 1),
	(N'stat', N'projects', N'2,600+', N'Completed Projects', NULL, NULL, 2),
	(N'stat', N'countries', N'46', N'Export Countries', NULL, NULL, 3),
	(N'stat', N'skus', N'360+', N'Product SKUs', NULL, NULL, 4),
	(N'product', N'aurora', N'AURORA Series', N'Freestanding Bathtub', N'Solid surface integrated molding, streamline design, constant temperature insulation technology', N'/src/assets/1.png', 10),
	(N'product', N'vessel', N'VESSEL Series', N'Countertop Basin', N'Ultra-thin edge, nano self-cleaning glaze, antibacterial ceramic technology', N'/src/assets/hero.png', 11),
	(N'product', N'nexus', N'NEXUS Series', N'Smart Toilet', N'Instant heating system, auto lid sensor, UV sterilization & deodorization', N'/src/assets/1.png', 12),
	(N'product', N'modular', N'MODULAR Series', N'Bathroom Cabinet', N'Modular design, moisture-proof multilayer wood, soft close hinge technology', N'/src/assets/hero.png', 13)
) AS source(ContentType, ContentKey, Title, Subtitle, Body, ImageUrl, SortOrder)
ON target.ContentType = source.ContentType AND target.ContentKey = source.ContentKey
WHEN NOT MATCHED THEN
	INSERT (ContentType, ContentKey, Title, Subtitle, Body, ImageUrl, SortOrder)
	VALUES (source.ContentType, source.ContentKey, source.Title, source.Subtitle, source.Body, source.ImageUrl, source.SortOrder);
GO

SELECT N'Site content table and seed data are ready' AS Result
GO

