import { getPool, execute } from './db.js';

const createTables = async () => {
  await getPool();
  console.log('Connected to SQL Server');

  console.log('Creating tables...');

  // Users table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
    CREATE TABLE Users (
      id NVARCHAR(36) PRIMARY KEY,
      name NVARCHAR(255) NOT NULL,
      email NVARCHAR(255) NOT NULL UNIQUE,
      password NVARCHAR(255) NOT NULL,
      role NVARCHAR(50) DEFAULT 'customer',
      wholesaleStatus NVARCHAR(50) DEFAULT 'none',
      businessName NVARCHAR(255) NULL,
      phone NVARCHAR(50) NULL,
      addresses NVARCHAR(MAX) NULL,
      isBlocked BIT DEFAULT 0,
      resetPasswordToken NVARCHAR(255) NULL,
      resetPasswordExpires DATETIME2 NULL,
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Users table');

  // Categories table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
    CREATE TABLE Categories (
      id NVARCHAR(36) PRIMARY KEY,
      name NVARCHAR(255) NOT NULL,
      slug NVARCHAR(255) NOT NULL UNIQUE,
      image NVARCHAR(500) NULL,
      parentId NVARCHAR(36) NULL,
      isActive BIT DEFAULT 1,
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Categories table');

  // Products table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' AND xtype='U')
    CREATE TABLE Products (
      id NVARCHAR(36) PRIMARY KEY,
      name NVARCHAR(500) NOT NULL,
      slug NVARCHAR(500) NOT NULL UNIQUE,
      brand NVARCHAR(255) NULL,
      categoryId NVARCHAR(36) NULL,
      description NVARCHAR(MAX) NULL,
      specifications NVARCHAR(MAX) NULL,
      retailPrice DECIMAL(18,2) NOT NULL,
      wholesalePrice DECIMAL(18,2) NULL,
      wholesaleMinQty INT DEFAULT 5,
      costPrice DECIMAL(18,2) NULL,
      stock INT DEFAULT 0,
      lowStockThreshold INT DEFAULT 5,
      images NVARCHAR(MAX) NULL,
      condition NVARCHAR(50) DEFAULT 'new',
      isFeatured BIT DEFAULT 0,
      isNewArrival BIT DEFAULT 0,
      isBestSeller BIT DEFAULT 0,
      isActive BIT DEFAULT 1,
      tags NVARCHAR(MAX) NULL,
      averageRating DECIMAL(3,2) DEFAULT 0,
      numReviews INT DEFAULT 0,
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Products table');

  // Orders table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' AND xtype='U')
    CREATE TABLE Orders (
      id NVARCHAR(36) PRIMARY KEY,
      userId NVARCHAR(36) NULL,
      guestEmail NVARCHAR(255) NULL,
      orderNumber NVARCHAR(100) NOT NULL UNIQUE,
      items NVARCHAR(MAX) NOT NULL,
      shippingAddress NVARCHAR(MAX) NOT NULL,
      billingAddress NVARCHAR(MAX) NOT NULL,
      paymentMethod NVARCHAR(50) NOT NULL,
      paymentStatus NVARCHAR(50) DEFAULT 'pending',
      paymentDetails NVARCHAR(MAX) NULL,
      subtotal DECIMAL(18,2) NOT NULL,
      discount DECIMAL(18,2) DEFAULT 0,
      couponCode NVARCHAR(100) NULL,
      shippingCost DECIMAL(18,2) DEFAULT 0,
      tax DECIMAL(18,2) DEFAULT 0,
      total DECIMAL(18,2) NOT NULL,
      currency NVARCHAR(10) DEFAULT 'PKR',
      status NVARCHAR(50) DEFAULT 'pending',
      statusHistory NVARCHAR(MAX) NULL,
      trackingNumber NVARCHAR(200) NULL,
      notes NVARCHAR(MAX) NULL,
      invoiceNumber NVARCHAR(100) NULL,
      invoiceUrl NVARCHAR(500) NULL,
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Orders table');

  // Carts table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Carts' AND xtype='U')
    CREATE TABLE Carts (
      id NVARCHAR(36) PRIMARY KEY,
      userId NVARCHAR(36) NOT NULL,
      items NVARCHAR(MAX) NOT NULL,
      couponCode NVARCHAR(100) NULL,
      discount DECIMAL(18,2) DEFAULT 0,
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Carts table');

  // Reviews table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Reviews' AND xtype='U')
    CREATE TABLE Reviews (
      id NVARCHAR(36) PRIMARY KEY,
      productId NVARCHAR(36) NOT NULL,
      userId NVARCHAR(36) NOT NULL,
      rating INT NOT NULL,
      title NVARCHAR(255) NULL,
      comment NVARCHAR(MAX) NULL,
      isApproved BIT DEFAULT 0,
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Reviews table');

  // Wishlists table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Wishlists' AND xtype='U')
    CREATE TABLE Wishlists (
      id NVARCHAR(36) PRIMARY KEY,
      userId NVARCHAR(36) NOT NULL,
      products NVARCHAR(MAX) NOT NULL,
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Wishlists table');

  // Coupons table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Coupons' AND xtype='U')
    CREATE TABLE Coupons (
      id NVARCHAR(36) PRIMARY KEY,
      code NVARCHAR(50) NOT NULL UNIQUE,
      type NVARCHAR(50) NOT NULL,
      description NVARCHAR(500) NULL,
      value DECIMAL(18,2) NOT NULL,
      minOrderAmount DECIMAL(18,2) DEFAULT 0,
      maxUses INT DEFAULT 100,
      usedCount INT DEFAULT 0,
      isActive BIT DEFAULT 1,
      startDate DATETIME2 NULL,
      expiresAt DATETIME2 NULL,
      appliesTo NVARCHAR(50) DEFAULT 'all',
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Coupons table');

  // Banners table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Banners' AND xtype='U')
    CREATE TABLE Banners (
      id NVARCHAR(36) PRIMARY KEY,
      title NVARCHAR(255) NOT NULL,
      subtitle NVARCHAR(500) NULL,
      image NVARCHAR(500) NOT NULL,
      link NVARCHAR(500) NULL,
      position INT DEFAULT 0,
      isActive BIT DEFAULT 1,
      createdAt DATETIME2 DEFAULT GETDATE(),
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Banners table');

  // Settings table
  await execute(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Settings' AND xtype='U')
    CREATE TABLE Settings (
      id NVARCHAR(36) PRIMARY KEY,
      [key] NVARCHAR(100) NOT NULL UNIQUE,
      value NVARCHAR(MAX) NOT NULL,
      updatedAt DATETIME2 DEFAULT GETDATE()
    )
  `);
  console.log('✓ Settings table');

  console.log('\n✅ All tables created successfully!');
};

createTables()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1); });
