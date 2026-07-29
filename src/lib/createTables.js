import { execute } from '@/lib/db';

const createTables = async () => {
  try {
    console.log('Creating tables...');

    // Users table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
        wholesaleStatus NVARCHAR(50) DEFAULT 'none' CHECK (wholesaleStatus IN ('none', 'pending', 'approved', 'rejected')),
        businessName NVARCHAR(255) NULL,
        phone NVARCHAR(50) NULL,
        addresses NVARCHAR(MAX) NULL,
        isBlocked BIT DEFAULT 0,
        resetPasswordToken NVARCHAR(255) NULL,
        resetPasswordExpires DATETIME NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Users table created');

    // Categories table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
      CREATE TABLE Categories (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(255) NOT NULL,
        slug NVARCHAR(255) NOT NULL UNIQUE,
        image NVARCHAR(500) NULL,
        parentId NVARCHAR(36) NULL FOREIGN KEY REFERENCES Categories(id),
        isActive BIT DEFAULT 1,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Categories table created');

    // Products table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' AND xtype='U')
      CREATE TABLE Products (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(500) NOT NULL,
        slug NVARCHAR(500) NOT NULL UNIQUE,
        brand NVARCHAR(255) NULL,
        categoryId NVARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Categories(id),
        description NVARCHAR(MAX) NULL,
        specifications NVARCHAR(MAX) NULL,
        retailPrice DECIMAL(18,2) NOT NULL,
        wholesalePrice DECIMAL(18,2) NULL,
        wholesaleMinQty INT DEFAULT 5,
        costPrice DECIMAL(18,2) NULL,
        stock INT DEFAULT 0,
        lowStockThreshold INT DEFAULT 5,
        images NVARCHAR(MAX) NULL,
        condition NVARCHAR(50) DEFAULT 'new' CHECK (condition IN ('new', 'refurbished', 'open_box')),
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
    console.log('Products table created');

    // Orders table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' AND xtype='U')
      CREATE TABLE Orders (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        userId NVARCHAR(36) NULL FOREIGN KEY REFERENCES Users(id),
        guestEmail NVARCHAR(255) NULL,
        orderNumber NVARCHAR(100) NOT NULL UNIQUE,
        items NVARCHAR(MAX) NOT NULL,
        shippingAddress NVARCHAR(MAX) NOT NULL,
        billingAddress NVARCHAR(MAX) NOT NULL,
        paymentMethod NVARCHAR(50) NOT NULL CHECK (paymentMethod IN ('card', 'cod', 'bank_transfer', 'jazzcash', 'easypaisa')),
        paymentStatus NVARCHAR(50) DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'paid', 'failed', 'refunded')),
        paymentDetails NVARCHAR(MAX) NULL,
        subtotal DECIMAL(18,2) NOT NULL,
        discount DECIMAL(18,2) DEFAULT 0,
        couponCode NVARCHAR(100) NULL,
        shippingCost DECIMAL(18,2) DEFAULT 0,
        tax DECIMAL(18,2) DEFAULT 0,
        total DECIMAL(18,2) NOT NULL,
        currency NVARCHAR(10) DEFAULT 'PKR',
        status NVARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
        statusHistory NVARCHAR(MAX) NULL,
        trackingNumber NVARCHAR(200) NULL,
        notes NVARCHAR(MAX) NULL,
        invoiceNumber NVARCHAR(100) NULL,
        invoiceUrl NVARCHAR(500) NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Orders table created');

    // Carts table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Carts' AND xtype='U')
      CREATE TABLE Carts (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        userId NVARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Users(id),
        items NVARCHAR(MAX) NOT NULL,
        couponCode NVARCHAR(100) NULL,
        discount DECIMAL(18,2) DEFAULT 0,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Carts table created');

    // Reviews table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Reviews' AND xtype='U')
      CREATE TABLE Reviews (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        productId NVARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Products(id),
        userId NVARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Users(id),
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        title NVARCHAR(255) NULL,
        comment NVARCHAR(MAX) NULL,
        isApproved BIT DEFAULT 0,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Reviews table created');

    // Wishlists table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Wishlists' AND xtype='U')
      CREATE TABLE Wishlists (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        userId NVARCHAR(36) NOT NULL FOREIGN KEY REFERENCES Users(id),
        products NVARCHAR(MAX) NOT NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Wishlists table created');

    // Coupons table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Coupons' AND xtype='U')
      CREATE TABLE Coupons (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        code NVARCHAR(50) NOT NULL UNIQUE,
        type NVARCHAR(50) NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
        description NVARCHAR(500) NULL,
        value DECIMAL(18,2) NOT NULL,
        minOrderAmount DECIMAL(18,2) DEFAULT 0,
        maxUses INT DEFAULT 100,
        usedCount INT DEFAULT 0,
        isActive BIT DEFAULT 1,
        startDate DATETIME2 NULL,
        expiresAt DATETIME2 NULL,
        appliesTo NVARCHAR(MAX) NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Coupons table created');

    // Banners table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Banners' AND xtype='U')
      CREATE TABLE Banners (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        title NVARCHAR(255) NOT NULL,
        subtitle NVARCHAR(500) NULL,
        image NVARCHAR(500) NOT NULL,
        link NVARCHAR(500) NULL,
        position NVARCHAR(50) DEFAULT 'hero' CHECK (position IN ('hero', 'sidebar', 'footer', 'category')),
        isActive BIT DEFAULT 1,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Banners table created');

    // Settings table
    await execute(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Settings' AND xtype='U')
      CREATE TABLE Settings (
        id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        [key] NVARCHAR(100) NOT NULL UNIQUE,
        value NVARCHAR(MAX) NOT NULL,
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Settings table created');

    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

export default createTables;