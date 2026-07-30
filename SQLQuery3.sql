USE [master]
GO
USE [db61644]
GO
/****** Object:  Table [dbo].[Banners]    Script Date: 7/30/2026 12:19:54 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Banners](
	[id] [nvarchar](36) NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[subtitle] [nvarchar](500) NULL,
	[image] [nvarchar](500) NOT NULL,
	[link] [nvarchar](500) NULL,
	[position] [int] NULL,
	[isActive] [bit] NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Carts]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Carts](
	[id] [nvarchar](36) NOT NULL,
	[userId] [nvarchar](36) NOT NULL,
	[items] [nvarchar](max) NOT NULL,
	[couponCode] [nvarchar](100) NULL,
	[discount] [decimal](18, 2) NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[id] [nvarchar](36) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[slug] [nvarchar](255) NOT NULL,
	[image] [nvarchar](500) NULL,
	[parentId] [nvarchar](36) NULL,
	[isActive] [bit] NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Coupons]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Coupons](
	[id] [nvarchar](36) NOT NULL,
	[code] [nvarchar](50) NOT NULL,
	[type] [nvarchar](50) NOT NULL,
	[description] [nvarchar](500) NULL,
	[value] [decimal](18, 2) NOT NULL,
	[minOrderAmount] [decimal](18, 2) NULL,
	[maxUses] [int] NULL,
	[usedCount] [int] NULL,
	[isActive] [bit] NULL,
	[startDate] [datetime2](7) NULL,
	[expiresAt] [datetime2](7) NULL,
	[appliesTo] [nvarchar](50) NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[id] [nvarchar](36) NOT NULL,
	[userId] [nvarchar](36) NULL,
	[guestEmail] [nvarchar](255) NULL,
	[orderNumber] [nvarchar](100) NOT NULL,
	[items] [nvarchar](max) NOT NULL,
	[shippingAddress] [nvarchar](max) NOT NULL,
	[billingAddress] [nvarchar](max) NOT NULL,
	[paymentMethod] [nvarchar](50) NOT NULL,
	[paymentStatus] [nvarchar](50) NULL,
	[paymentDetails] [nvarchar](max) NULL,
	[subtotal] [decimal](18, 2) NOT NULL,
	[discount] [decimal](18, 2) NULL,
	[couponCode] [nvarchar](100) NULL,
	[shippingCost] [decimal](18, 2) NULL,
	[tax] [decimal](18, 2) NULL,
	[total] [decimal](18, 2) NOT NULL,
	[currency] [nvarchar](10) NULL,
	[status] [nvarchar](50) NULL,
	[statusHistory] [nvarchar](max) NULL,
	[trackingNumber] [nvarchar](200) NULL,
	[notes] [nvarchar](max) NULL,
	[invoiceNumber] [nvarchar](100) NULL,
	[invoiceUrl] [nvarchar](500) NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[id] [nvarchar](36) NOT NULL,
	[name] [nvarchar](500) NOT NULL,
	[slug] [nvarchar](500) NOT NULL,
	[brand] [nvarchar](255) NULL,
	[categoryId] [nvarchar](36) NULL,
	[description] [nvarchar](max) NULL,
	[specifications] [nvarchar](max) NULL,
	[retailPrice] [decimal](18, 2) NOT NULL,
	[wholesalePrice] [decimal](18, 2) NULL,
	[wholesaleMinQty] [int] NULL,
	[costPrice] [decimal](18, 2) NULL,
	[stock] [int] NULL,
	[lowStockThreshold] [int] NULL,
	[images] [nvarchar](max) NULL,
	[condition] [nvarchar](50) NULL,
	[isFeatured] [bit] NULL,
	[isNewArrival] [bit] NULL,
	[isBestSeller] [bit] NULL,
	[isActive] [bit] NULL,
	[tags] [nvarchar](max) NULL,
	[averageRating] [decimal](3, 2) NULL,
	[numReviews] [int] NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reviews]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reviews](
	[id] [nvarchar](36) NOT NULL,
	[productId] [nvarchar](36) NOT NULL,
	[userId] [nvarchar](36) NOT NULL,
	[rating] [int] NOT NULL,
	[title] [nvarchar](255) NULL,
	[comment] [nvarchar](max) NULL,
	[isApproved] [bit] NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Settings]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Settings](
	[id] [nvarchar](36) NOT NULL,
	[key] [nvarchar](100) NOT NULL,
	[value] [nvarchar](max) NOT NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[id] [nvarchar](36) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[password] [nvarchar](255) NOT NULL,
	[role] [nvarchar](50) NULL,
	[wholesaleStatus] [nvarchar](50) NULL,
	[businessName] [nvarchar](255) NULL,
	[phone] [nvarchar](50) NULL,
	[addresses] [nvarchar](max) NULL,
	[isBlocked] [bit] NULL,
	[resetPasswordToken] [nvarchar](255) NULL,
	[resetPasswordExpires] [datetime2](7) NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Wishlists]    Script Date: 7/30/2026 12:19:55 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Wishlists](
	[id] [nvarchar](36) NOT NULL,
	[userId] [nvarchar](36) NOT NULL,
	[products] [nvarchar](max) NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[Categories] ([id], [name], [slug], [image], [parentId], [isActive], [createdAt], [updatedAt]) VALUES (N'5efed241-a8d2-4c77-8dec-6e6bf331f5f8', N'Accessories', N'accessories', NULL, NULL, 1, CAST(N'2026-07-29T21:08:18.7600000' AS DateTime2), CAST(N'2026-07-29T21:08:18.7600000' AS DateTime2))
GO
INSERT [dbo].[Categories] ([id], [name], [slug], [image], [parentId], [isActive], [createdAt], [updatedAt]) VALUES (N'f7559d45-7229-4de6-ad78-9be7791257b8', N'Laptops', N'laptops', NULL, NULL, 1, CAST(N'2026-07-29T21:08:18.7533333' AS DateTime2), CAST(N'2026-07-29T21:08:18.7533333' AS DateTime2))
GO
INSERT [dbo].[Categories] ([id], [name], [slug], [image], [parentId], [isActive], [createdAt], [updatedAt]) VALUES (N'fd7404f0-834d-4949-b043-05ca5cc1abc4', N'Components', N'components', NULL, NULL, 1, CAST(N'2026-07-29T21:08:18.7633333' AS DateTime2), CAST(N'2026-07-29T21:08:18.7633333' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'0d47b89b-31e7-4ef9-b56b-d1d15e11c2cb', N'Dell G15 Gaming Laptop', N'dell-g15-gaming', N'Dell', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'15.6-inch 165Hz gaming display, AMD Ryzen 7, RTX 4060, 16GB RAM, 512GB SSD, Alienware-inspired thermal design', N'{"processor":"AMD Ryzen 7 7840HS","processorBrand":"AMD","processorModel":"Ryzen 7 7840HS","ram":"16GB","ramType":"DDR5","storage":"512GB","storageType":"NVMe","gpu":"NVIDIA GeForce RTX 4060","displaySize":"15.6\"","displayResolution":"2560 x 1440","displayType":"IPS QHD 165Hz","battery":"7 hours","ports":"USB-C, USB-A (x3), HDMI 2.1, Ethernet, Headphone Jack","os":"Windows 11","weight":"2.81 kg","warranty":"1 year","color":"Dark Shadow Gray"}', CAST(1199.00 AS Decimal(18, 2)), CAST(1049.00 AS Decimal(18, 2)), 5, CAST(680.00 AS Decimal(18, 2)), 11, 3, N'["dell-g15.svg","g15-rgb.svg"]', N'new', 0, 1, 1, 1, N'["Dell","G15","Gaming","RTX 4060","165Hz"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:09:34.7100000' AS DateTime2), CAST(N'2026-07-29T21:09:34.7100000' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'157d4dbc-3956-4e7d-9045-5e12243fb17f', N'HP ProBook 450 G10', N'hp-probook-450-g10', N'HP', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'15.6-inch business laptop, Intel Core i5, 16GB RAM, 512GB SSD, perfect for small to medium businesses', N'{"processor":"Intel Core i5-1340P","processorBrand":"Intel","processorModel":"i5-1340P","ram":"16GB","ramType":"DDR5","storage":"512GB","storageType":"NVMe","gpu":"Intel Iris Xe Graphics","displaySize":"15.6\"","displayResolution":"1920 x 1080","displayType":"IPS Anti-glare","battery":"11 hours","ports":"USB-C, USB-A (x2), HDMI, RJ45 Ethernet","os":"Windows 11 Pro","weight":"1.78 kg","warranty":"2 years","color":"Natural Silver"}', CAST(1099.00 AS Decimal(18, 2)), CAST(949.00 AS Decimal(18, 2)), 5, CAST(600.00 AS Decimal(18, 2)), 22, 5, N'["probook-450-g10.svg","probook-top.svg"]', N'new', 0, 0, 0, 1, N'["HP","ProBook","Business","i5","15-inch"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:09:34.6866667' AS DateTime2), CAST(N'2026-07-29T21:09:34.6866667' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'23a60b1f-2608-4bef-9dc9-f7ca5c57ce71', N'Refurbished Dell Latitude 7420', N'refurbished-dell-latitude-7420', N'Dell', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'Business-grade 14" laptop, Intel i5, 8GB RAM, 256GB SSD, professionally refurbished', N'{"processor":"Intel Core i5-1135G7","processorBrand":"Intel","processorModel":"i5-1135G7","ram":"8GB","ramType":"DDR4","storage":"256GB","storageType":"SSD","gpu":"Intel Iris Xe Graphics","displaySize":"14\"","displayResolution":"1920 x 1080","displayType":"IPS","battery":"10 hours","ports":"USB-C, USB-A, HDMI","os":"Windows 10 Pro","weight":"1.27 kg","warranty":"90 days","color":"Black"}', CAST(499.00 AS Decimal(18, 2)), CAST(449.00 AS Decimal(18, 2)), 10, CAST(300.00 AS Decimal(18, 2)), 25, 5, N'["latitude-7420-refurb.svg","dell-logo.svg"]', N'refurbished', 0, 0, 0, 1, N'["Dell","Latitude","Business","Refurbished","14-inch"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.8733333' AS DateTime2), CAST(N'2026-07-29T21:08:18.8733333' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'39187c8a-3116-45e6-b2c2-1ccf8aa9cbcd', N'Acer Swift X', N'acer-swift-x', N'Acer', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'14-inch creator laptop with AMD Ryzen 7, RTX 3050', N'{"processor":"AMD Ryzen 7 6800U","processorBrand":"AMD","processorModel":"Ryzen 7 6800U","ram":"16GB","ramType":"DDR5","storage":"512GB","storageType":"NVMe","gpu":"NVIDIA GeForce RTX 3050","displaySize":"14\"","displayResolution":"1920 x 1080","displayType":"IPS","battery":"11 hours","ports":"USB-C, USB-A, HDMI","os":"Windows 11","weight":"1.39 kg","warranty":"2 years","color":"Steel Gray"}', CAST(1099.00 AS Decimal(18, 2)), CAST(949.00 AS Decimal(18, 2)), 5, CAST(550.00 AS Decimal(18, 2)), 14, 3, N'["swift-x.svg","swift-x-side.svg"]', N'new', 0, 1, 0, 1, N'["Acer","Swift","Creator","RTX 3050","14-inch"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.8566667' AS DateTime2), CAST(N'2026-07-29T21:08:18.8566667' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'4bdc3f59-b26b-4013-b4c8-81f51c00fdd4', N'ASUS ROG Zephyrus G14', N'asus-rog-zephyrus-g14', N'ASUS', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'14-inch gaming laptop with AMD Ryzen 9, RTX 4060, 32GB RAM, 1TB SSD', N'{"processor":"AMD Ryzen 9 7940HS","processorBrand":"AMD","processorModel":"Ryzen 9 7940HS","ram":"32GB","ramType":"DDR5","storage":"1TB","storageType":"NVMe","gpu":"NVIDIA GeForce RTX 4060","displaySize":"14\"","displayResolution":"2560 x 1440","displayType":"IPS QHD","battery":"10 hours","ports":"USB-C, USB-A, HDMI 2.1","os":"Windows 11","weight":"1.7 kg","warranty":"2 years","color":"Eclipse Gray"}', CAST(1799.00 AS Decimal(18, 2)), CAST(1599.00 AS Decimal(18, 2)), 5, CAST(1100.00 AS Decimal(18, 2)), 10, 3, N'["zephyrus-g14.svg","rog-logo.svg"]', N'new', 1, 0, 1, 1, N'["ASUS","ROG","Gaming","RTX 4060","14-inch"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.8166667' AS DateTime2), CAST(N'2026-07-29T21:08:18.8166667' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'4ea42697-79e0-4183-aa4f-e0d36a201231', N'Apple MacBook Air M2', N'apple-macbook-air-m2', N'Apple', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'13.6-inch Liquid Retina display, M2 chip, 8GB RAM, 256GB SSD, fanless design', N'{"processor":"Apple M2","processorBrand":"Apple","processorModel":"M2","ram":"8GB","ramType":"LPDDR5","storage":"256GB","storageType":"NVMe","gpu":"Integrated GPU","displaySize":"13.6\"","displayResolution":"2560 x 1664","displayType":"Liquid Retina","battery":"18 hours","ports":"USB-C, Thunderbolt","os":"macOS","weight":"1.24 kg","warranty":"1 year","color":"Starlight"}', CAST(1199.00 AS Decimal(18, 2)), CAST(1049.00 AS Decimal(18, 2)), 5, CAST(650.00 AS Decimal(18, 2)), 20, 5, N'["macbook-air-m2.svg","starlight-macbook.svg"]', N'new', 1, 0, 1, 1, N'["Macbook","Air","M2","13-inch","Fanless"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.8333333' AS DateTime2), CAST(N'2026-07-29T21:08:18.8333333' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'6fc2fb7f-201c-4e49-9c39-0a8fc743bb0b', N'Dell XPS 15', N'dell-xps-15', N'Dell', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'15.6-inch 4K touchscreen, Intel i9 processor, 32GB RAM, 1TB SSD, Platinum Silver color', N'{"processor":"Intel Core i9-13900H","processorBrand":"Intel","processorModel":"i9-13900H","ram":"32GB","ramType":"DDR5","storage":"1TB","storageType":"NVMe","gpu":"Intel Arc A770M","displaySize":"15.6\"","displayResolution":"3840 x 2400","displayType":"IPS Touch","battery":"12 hours","ports":"USB-C, USB-A, HDMI, SD Card","os":"Windows 11","weight":"2.0 kg","warranty":"1 year","color":"Platinum Silver"}', CAST(1599.00 AS Decimal(18, 2)), CAST(1399.00 AS Decimal(18, 2)), 5, CAST(950.00 AS Decimal(18, 2)), 8, 2, N'["dell-xps-15.svg","dell-xps-15-silver.svg"]', N'new', 1, 0, 1, 1, N'["Dell","XPS","15-inch","4K","Touchscreen"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.7766667' AS DateTime2), CAST(N'2026-07-29T21:08:18.7766667' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'7408f39d-1d96-4ba9-8851-786e69c368a9', N'Used MacBook Pro 13-inch M1', N'used-macbook-pro-m1', N'Apple', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'13.3-inch Retina display, Apple M1 chip, 8GB RAM, 256GB SSD, space gray, lightly used', N'{"processor":"Apple M1","processorBrand":"Apple","processorModel":"M1","ram":"8GB","ramType":"LPDDR4X","storage":"256GB","storageType":"NVMe","gpu":"Integrated GPU","displaySize":"13.3\"","displayResolution":"2560 x 1600","displayType":"Retina","battery":"8 hours remaining","ports":"USB-C, Thunderbolt","os":"macOS Ventura","weight":"1.4 kg","warranty":"30 days","color":"Space Gray"}', CAST(699.00 AS Decimal(18, 2)), CAST(629.00 AS Decimal(18, 2)), 5, CAST(400.00 AS Decimal(18, 2)), 7, 2, N'["macbook-pro-m1-used.svg","used-macbook.svg"]', N'used', 0, 0, 0, 1, N'["Apple","MacBook Pro","M1","Used","13-inch"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.8800000' AS DateTime2), CAST(N'2026-07-29T21:08:18.8800000' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'76ed5a21-7884-4ca7-a288-d9cc819b8dfc', N'Dell Precision 5570 Workstation', N'dell-precision-5570', N'Dell', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'15.6-inch mobile workstation with Intel Core i9, NVIDIA RTX A2000, 32GB RAM, 1TB SSD, ISV certified', N'{"processor":"Intel Core i9-13900H","processorBrand":"Intel","processorModel":"i9-13900H","ram":"32GB","ramType":"DDR5 ECC","storage":"1TB","storageType":"NVMe","gpu":"NVIDIA RTX A2000 8GB","displaySize":"15.6\"","displayResolution":"3840 x 2400","displayType":"OLED UHD+","battery":"10 hours","ports":"USB-C Thunderbolt 4 (x4), SD Card, HDMI","os":"Windows 11 Pro","weight":"2.0 kg","warranty":"3 years","color":"Titanium Gray"}', CAST(2899.00 AS Decimal(18, 2)), CAST(2599.00 AS Decimal(18, 2)), 5, CAST(1700.00 AS Decimal(18, 2)), 5, 2, N'["precision-5570.svg","precision-deck.svg"]', N'new', 1, 0, 0, 1, N'["Dell","Precision","Workstation","i9","RTX A2000"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:09:34.7000000' AS DateTime2), CAST(N'2026-07-29T21:09:34.7000000' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'82047d5d-3965-4e39-830f-b1976eaf71da', N'Dell Latitude 5540', N'dell-latitude-5540', N'Dell', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'15.6-inch business laptop with Intel Core i7 vPro, 16GB RAM, 256GB SSD, enterprise-grade security', N'{"processor":"Intel Core i7-1355U vPro","processorBrand":"Intel","processorModel":"i7-1355U","ram":"16GB","ramType":"DDR5","storage":"256GB","storageType":"NVMe","gpu":"Intel Iris Xe Graphics","displaySize":"15.6\"","displayResolution":"1920 x 1080","displayType":"IPS Anti-glare","battery":"13 hours","ports":"USB-C Thunderbolt 4, USB-A (x2), HDMI, RJ45, Headphone Jack","os":"Windows 11 Pro","weight":"1.74 kg","warranty":"3 years","color":"Titanium Gray"}', CAST(1449.00 AS Decimal(18, 2)), CAST(1279.00 AS Decimal(18, 2)), 5, CAST(800.00 AS Decimal(18, 2)), 16, 4, N'["latitude-5540.svg","latitude-open.svg"]', N'new', 0, 0, 0, 1, N'["Dell","Latitude","Business","vPro","15-inch"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:09:34.7200000' AS DateTime2), CAST(N'2026-07-29T21:09:34.7200000' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'8ca4b02d-9600-4de2-958f-489ec17e66d5', N'Dell Inspiron 16 Plus', N'dell-inspiron-16-plus', N'Dell', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'16-inch 2K display, Intel Core i7, 16GB RAM, 1TB SSD, for creators and professionals', N'{"processor":"Intel Core i7-13700H","processorBrand":"Intel","processorModel":"i7-13700H","ram":"16GB","ramType":"DDR5","storage":"1TB","storageType":"NVMe","gpu":"NVIDIA GeForce RTX 3050","displaySize":"16\"","displayResolution":"2560 x 1600","displayType":"IPS 2K","battery":"12 hours","ports":"USB-C (x2), USB-A (x2), HDMI 2.0, SD Card","os":"Windows 11","weight":"2.0 kg","warranty":"1 year","color":"Platinum Silver"}', CAST(1299.00 AS Decimal(18, 2)), CAST(1149.00 AS Decimal(18, 2)), 5, CAST(720.00 AS Decimal(18, 2)), 14, 3, N'["dell-inspiron-16-plus.svg","inspiron-16-side.svg"]', N'new', 0, 1, 0, 1, N'["Dell","Inspiron","16-inch","Creator","RTX 3050"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:09:34.6933333' AS DateTime2), CAST(N'2026-07-29T21:09:34.6933333' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'ac7d1c10-9bbf-429f-9454-1d1393c27783', N'HP Victus 16 Gaming', N'hp-victus-16-gaming', N'HP', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'16.1-inch gaming laptop with AMD Ryzen 7, RTX 4060, 16GB RAM, 1TB SSD, 144Hz display', N'{"processor":"AMD Ryzen 7 7840HS","processorBrand":"AMD","processorModel":"Ryzen 7 7840HS","ram":"16GB","ramType":"DDR5","storage":"1TB","storageType":"NVMe","gpu":"NVIDIA GeForce RTX 4060","displaySize":"16.1\"","displayResolution":"1920 x 1080","displayType":"IPS 144Hz","battery":"8 hours","ports":"USB-C, USB-A (x3), HDMI 2.1, Ethernet","os":"Windows 11","weight":"2.48 kg","warranty":"1 year","color":"Performance Blue"}', CAST(1399.00 AS Decimal(18, 2)), CAST(1199.00 AS Decimal(18, 2)), 5, CAST(800.00 AS Decimal(18, 2)), 7, 2, N'["hp-victus-16.svg","victus-kb.svg"]', N'new', 0, 1, 0, 1, N'["HP","Victus","Gaming","RTX 4060","144Hz"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:09:34.6766667' AS DateTime2), CAST(N'2026-07-29T21:09:34.6766667' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'bc72f72c-7ef6-4aa9-8832-2b2f2c55c047', N'HP Pavilion 15', N'hp-pavilion-15', N'HP', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'15.6-inch Full HD display, Intel Core i7, 16GB RAM, 512GB SSD, reliable performance for everyday productivity and entertainment', N'{"processor":"Intel Core i7-1355U","processorBrand":"Intel","processorModel":"i7-1355U","ram":"16GB","ramType":"DDR4","storage":"512GB","storageType":"NVMe","gpu":"Intel Iris Xe Graphics","displaySize":"15.6\"","displayResolution":"1920 x 1080","displayType":"IPS","battery":"10 hours","ports":"USB-C, USB-A (x2), HDMI, Headphone Jack","os":"Windows 11","weight":"1.75 kg","warranty":"1 year","color":"Natural Silver"}', CAST(899.00 AS Decimal(18, 2)), CAST(779.00 AS Decimal(18, 2)), 5, CAST(500.00 AS Decimal(18, 2)), 18, 4, N'["hp-pavilion-15.svg","hp-pavilion-side.svg"]', N'new', 0, 1, 0, 1, N'["HP","Pavilion","15-inch","i7","Everyday"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:09:34.6500000' AS DateTime2), CAST(N'2026-07-29T21:09:34.6500000' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'bf8bf051-df07-435b-95fb-31e1193dd70f', N'HP EliteBook 840 G10', N'hp-elitebook-840-g10', N'HP', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'14-inch premium business laptop with Intel Core i7 vPro, 32GB RAM, 512GB SSD, advanced security features', N'{"processor":"Intel Core i7-1365U vPro","processorBrand":"Intel","processorModel":"i7-1365U","ram":"32GB","ramType":"DDR5","storage":"512GB","storageType":"NVMe","gpu":"Intel Iris Xe Graphics","displaySize":"14\"","displayResolution":"1920 x 1080","displayType":"IPS Anti-glare","battery":"14 hours","ports":"USB-C (x2), USB-A (x2), HDMI 2.1, Headphone Jack","os":"Windows 11 Pro","weight":"1.38 kg","warranty":"3 years","color":"Silver"}', CAST(1799.00 AS Decimal(18, 2)), CAST(1599.00 AS Decimal(18, 2)), 5, CAST(1000.00 AS Decimal(18, 2)), 10, 3, N'["elitebook-840-g10.svg","elitebook-angle.svg"]', N'new', 1, 1, 0, 1, N'["HP","EliteBook","Business","vPro","14-inch"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:09:34.6666667' AS DateTime2), CAST(N'2026-07-29T21:09:34.6666667' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'd91b18a4-570c-4723-a69a-f7ece2a06c49', N'Microsoft Surface Laptop 5', N'microsoft-surface-laptop-5', N'Microsoft', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'13.5-inch touchscreen, Intel i7, 16GB RAM, 512GB SSD', N'{"processor":"Intel Core i7-1255U","processorBrand":"Intel","processorModel":"i7-1255U","ram":"16GB","ramType":"LPDDR5","storage":"512GB","storageType":"NVMe","gpu":"Intel Iris Xe Graphics","displaySize":"13.5\"","displayResolution":"2256 x 1504","displayType":"PixelSense Touch","battery":"17 hours","ports":"USB-C, USB-A, Surface Connect","os":"Windows 11","weight":"1.28 kg","warranty":"1 year","color":"Sage"}', CAST(1299.00 AS Decimal(18, 2)), CAST(1149.00 AS Decimal(18, 2)), 5, CAST(700.00 AS Decimal(18, 2)), 9, 2, N'["surface-laptop-5.svg","surface-alcantara.svg"]', N'new', 0, 1, 0, 1, N'["Microsoft","Surface","Touchscreen","13.5-inch","Alcantara"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.8500000' AS DateTime2), CAST(N'2026-07-29T21:08:18.8500000' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'd95eac77-39d1-4633-a4d6-4d3c6a5216cf', N'HP Spectre x360', N'hp-spectre-x360', N'HP', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'13.5-inch 2-in-1 convertible with 3K OLED display', N'{"processor":"Intel Core i7-1360P","processorBrand":"Intel","processorModel":"i7-1360P","ram":"16GB","ramType":"DDR5","storage":"1TB","storageType":"NVMe","gpu":"Intel Iris Xe Graphics","displaySize":"13.5\"","displayResolution":"3000 x 2000","displayType":"OLED Touch","battery":"12 hours","ports":"USB-C, Thunderbolt 4, HDMI","os":"Windows 11","weight":"1.36 kg","warranty":"1 year","color":"Nightfall Black"}', CAST(1499.00 AS Decimal(18, 2)), CAST(1299.00 AS Decimal(18, 2)), 5, CAST(750.00 AS Decimal(18, 2)), 6, 2, N'["spectre-x360.svg","spectre-tablet.svg"]', N'new', 0, 1, 0, 1, N'["HP","Spectre","2-in-1","Convertible","OLED"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.7866667' AS DateTime2), CAST(N'2026-07-29T21:08:18.7866667' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'dcc8ac94-8485-4928-9a38-77338b57f05e', N'Samsung Galaxy Book3 Pro', N'samsung-galaxy-book3-pro', N'Samsung', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'16-inch AMOLED 2K display, Intel i7, 16GB RAM, 1TB SSD', N'{"processor":"Intel Core i7-1360P","processorBrand":"Intel","processorModel":"i7-1360P","ram":"16GB","ramType":"LPDDR5","storage":"1TB","storageType":"NVMe","gpu":"Intel Iris Xe Graphics","displaySize":"16\"","displayResolution":"2880 x 1800","displayType":"AMOLED","battery":"16 hours","ports":"USB-C, Thunderbolt 4, HDMI","os":"Windows 11","weight":"1.56 kg","warranty":"1 year","color":"Graphite"}', CAST(1899.00 AS Decimal(18, 2)), CAST(1699.00 AS Decimal(18, 2)), 5, CAST(1000.00 AS Decimal(18, 2)), 5, 2, N'["galaxy-book3-pro.svg","s-pen.svg"]', N'new', 0, 1, 0, 1, N'["Samsung","Galaxy Book","AMOLED","16-inch","S Pen"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.8666667' AS DateTime2), CAST(N'2026-07-29T21:08:18.8666667' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'dffe2bef-0a37-4da7-b245-fe305b63c20d', N'Apple MacBook Pro M3', N'apple-macbook-pro-m3', N'Apple', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'14-inch Pro display, M3 chip, 16GB RAM, 512GB SSD storage, gold color, 18-hour battery life', N'{"processor":"Apple M3","processorBrand":"Apple","processorModel":"M3","ram":"16GB","ramType":"DDR5","storage":"512GB","storageType":"NVMe","gpu":"Integrated GPU","displaySize":"14\"","displayResolution":"3024 x 1946","displayType":"Mini-LED","battery":"18 hours","ports":"USB-C, Thunderbolt","os":"macOS","weight":"1.6 kg","warranty":"1 year","color":"Gold"}', CAST(1999.00 AS Decimal(18, 2)), CAST(1799.00 AS Decimal(18, 2)), 5, CAST(1300.00 AS Decimal(18, 2)), 12, 3, N'["macbook-pro-m3.svg","gold-macbook.svg"]', N'new', 1, 1, 1, 1, N'["Macbook","Apple","Pro","M3","14-inch"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.7700000' AS DateTime2), CAST(N'2026-07-29T21:08:18.7700000' AS DateTime2))
GO
INSERT [dbo].[Products] ([id], [name], [slug], [brand], [categoryId], [description], [specifications], [retailPrice], [wholesalePrice], [wholesaleMinQty], [costPrice], [stock], [lowStockThreshold], [images], [condition], [isFeatured], [isNewArrival], [isBestSeller], [isActive], [tags], [averageRating], [numReviews], [createdAt], [updatedAt]) VALUES (N'ea732ecd-18fb-4988-8a4c-9fdd99e454ae', N'Lenovo ThinkPad X1 Carbon', N'lenovo-thinkpad-x1-carbon', N'Lenovo', N'f7559d45-7229-4de6-ad78-9be7791257b8', N'Business ultraportable with 14" display, Intel i7, 16GB RAM, 512GB SSD', N'{"processor":"Intel Core i7-1365U","processorBrand":"Intel","processorModel":"i7-1365U","ram":"16GB","ramType":"DDR5","storage":"512GB","storageType":"NVMe","gpu":"Intel Iris Xe Graphics","displaySize":"14\"","displayResolution":"2880 x 1800","displayType":"OLED","battery":"15 hours","ports":"USB-C, USB-A, HDMI","os":"Windows 11 Pro","weight":"1.13 kg","warranty":"3 years","color":"Black"}', CAST(1699.00 AS Decimal(18, 2)), CAST(1499.00 AS Decimal(18, 2)), 5, CAST(900.00 AS Decimal(18, 2)), 15, 4, N'["thinkpad-x1-carbon.svg","thinkpad-keyboard.svg"]', N'new', 1, 1, 0, 1, N'["ThinkPad","Business","Ultrabook","14-inch","i7"]', CAST(0.00 AS Decimal(3, 2)), 0, CAST(N'2026-07-29T21:08:18.7800000' AS DateTime2), CAST(N'2026-07-29T21:08:18.7800000' AS DateTime2))
GO
INSERT [dbo].[Users] ([id], [name], [email], [password], [role], [wholesaleStatus], [businessName], [phone], [addresses], [isBlocked], [resetPasswordToken], [resetPasswordExpires], [createdAt], [updatedAt]) VALUES (N'329b4648-8c62-4d33-b01c-38102b0a98c7', N'Admin User', N'admin@db61644.pk', N'$2a$12$7s5Q1EvUEOxODak6ayiGoekTwFj2tp4PWMRAGJUYt3oZJhH4qeY0O', N'admin', N'none', NULL, N'+923005551234', NULL, 0, NULL, NULL, CAST(N'2026-07-29T21:08:19.3000000' AS DateTime2), CAST(N'2026-07-29T21:08:19.3000000' AS DateTime2))
GO
INSERT [dbo].[Users] ([id], [name], [email], [password], [role], [wholesaleStatus], [businessName], [phone], [addresses], [isBlocked], [resetPasswordToken], [resetPasswordExpires], [createdAt], [updatedAt]) VALUES (N'3e3bc68d-573a-42cc-a1a8-1b0f0a17c602', N'Fatima Ali', N'fatima@example.com', N'$2a$12$7s5Q1EvUEOxODak6ayiGoekTwFj2tp4PWMRAGJUYt3oZJhH4qeY0O', N'wholesale_customer', N'approved', N'Ali Traders', N'+923219876543', N'[{"label":"Office","street":"45 Business Avenue","city":"Karachi","state":"Sindh","zip":"75000","country":"Pakistan","isDefault":true}]', 0, NULL, NULL, CAST(N'2026-07-29T21:08:19.2966667' AS DateTime2), CAST(N'2026-07-29T21:08:19.2966667' AS DateTime2))
GO
INSERT [dbo].[Users] ([id], [name], [email], [password], [role], [wholesaleStatus], [businessName], [phone], [addresses], [isBlocked], [resetPasswordToken], [resetPasswordExpires], [createdAt], [updatedAt]) VALUES (N'409459db-af36-47b5-a85c-87df0136ef17', N'Manager User', N'manager@db61644.pk', N'$2a$12$7s5Q1EvUEOxODak6ayiGoekTwFj2tp4PWMRAGJUYt3oZJhH4qeY0O', N'manager', N'none', NULL, N'+923005555678', NULL, 0, NULL, NULL, CAST(N'2026-07-29T21:08:19.3033333' AS DateTime2), CAST(N'2026-07-29T21:08:19.3033333' AS DateTime2))
GO
INSERT [dbo].[Users] ([id], [name], [email], [password], [role], [wholesaleStatus], [businessName], [phone], [addresses], [isBlocked], [resetPasswordToken], [resetPasswordExpires], [createdAt], [updatedAt]) VALUES (N'4b3e1e53-a71d-4d2d-a656-7e75aaa948b3', N'Ahmed Khan', N'ahmed@example.com', N'$2a$12$7s5Q1EvUEOxODak6ayiGoekTwFj2tp4PWMRAGJUYt3oZJhH4qeY0O', N'customer', N'none', NULL, N'+923001234567', N'[{"label":"Home","street":"123 Main Street","city":"Lahore","state":"Punjab","zip":"54000","country":"Pakistan","isDefault":true}]', 0, NULL, NULL, CAST(N'2026-07-29T21:08:19.2933333' AS DateTime2), CAST(N'2026-07-29T21:08:19.2933333' AS DateTime2))
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Categori__32DD1E4C7FE433FA]    Script Date: 7/30/2026 12:19:55 AM ******/
ALTER TABLE [dbo].[Categories] ADD UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Coupons__357D4CF9E0DA7997]    Script Date: 7/30/2026 12:19:55 AM ******/
ALTER TABLE [dbo].[Coupons] ADD UNIQUE NONCLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Orders__6296129F0BA5DDBE]    Script Date: 7/30/2026 12:19:55 AM ******/
ALTER TABLE [dbo].[Orders] ADD UNIQUE NONCLUSTERED 
(
	[orderNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Products__32DD1E4C27A4A6FA]    Script Date: 7/30/2026 12:19:55 AM ******/
ALTER TABLE [dbo].[Products] ADD UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Settings__DFD83CAFADDADB28]    Script Date: 7/30/2026 12:19:55 AM ******/
ALTER TABLE [dbo].[Settings] ADD UNIQUE NONCLUSTERED 
(
	[key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__AB6E6164A39229F8]    Script Date: 7/30/2026 12:19:55 AM ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Banners] ADD  DEFAULT ((0)) FOR [position]
GO
ALTER TABLE [dbo].[Banners] ADD  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Banners] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Banners] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Carts] ADD  DEFAULT ((0)) FOR [discount]
GO
ALTER TABLE [dbo].[Carts] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Carts] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT ((0)) FOR [minOrderAmount]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT ((100)) FOR [maxUses]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT ((0)) FOR [usedCount]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT ('all') FOR [appliesTo]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ('pending') FOR [paymentStatus]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ((0)) FOR [discount]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ((0)) FOR [shippingCost]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ((0)) FOR [tax]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ('PKR') FOR [currency]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ('pending') FOR [status]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((5)) FOR [wholesaleMinQty]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [stock]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((5)) FOR [lowStockThreshold]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ('new') FOR [condition]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [isFeatured]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [isNewArrival]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [isBestSeller]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [averageRating]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [numReviews]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Reviews] ADD  DEFAULT ((0)) FOR [isApproved]
GO
ALTER TABLE [dbo].[Reviews] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Reviews] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Settings] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('customer') FOR [role]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('none') FOR [wholesaleStatus]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [isBlocked]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Wishlists] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Wishlists] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
USE [master]
GO
ALTER DATABASE [db61644] SET  READ_WRITE 
GO
