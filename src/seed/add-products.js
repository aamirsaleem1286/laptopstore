import { getPool, execute } from '../lib/db.js';
import { v4 as uuidv4 } from 'uuid';

const addMoreProducts = async () => {
  try {
    console.log('Connecting to SQL Server...');
    await getPool();
    const pool = await getPool();

    // Get the Laptops category ID
    const result = await pool.request()
      .query(`SELECT id FROM Categories WHERE slug = 'laptops'`);

    if (result.recordset.length === 0) {
      console.error('Laptops category not found. Run seed first.');
      process.exit(1);
    }

    const laptopCategoryId = result.recordset[0].id;

    // Additional HP Products
    const hpLaptops = [
      {
        name: 'HP Pavilion 15',
        slug: 'hp-pavilion-15',
        brand: 'HP',
        categoryId: laptopCategoryId,
        description: '15.6-inch Full HD display, Intel Core i7, 16GB RAM, 512GB SSD, reliable performance for everyday productivity and entertainment',
        specifications: JSON.stringify({
          processor: 'Intel Core i7-1355U',
          processorBrand: 'Intel',
          processorModel: 'i7-1355U',
          ram: '16GB',
          ramType: 'DDR4',
          storage: '512GB',
          storageType: 'NVMe',
          gpu: 'Intel Iris Xe Graphics',
          displaySize: '15.6"',
          displayResolution: '1920 x 1080',
          displayType: 'IPS',
          battery: '10 hours',
          ports: 'USB-C, USB-A (x2), HDMI, Headphone Jack',
          os: 'Windows 11',
          weight: '1.75 kg',
          warranty: '1 year',
          color: 'Natural Silver',
        }),
        retailPrice: 899,
        wholesalePrice: 779,
        wholesaleMinQty: 5,
        costPrice: 500,
        stock: 18,
        lowStockThreshold: 4,
        images: JSON.stringify(['hp-pavilion-15.jpg', 'hp-pavilion-side.jpg']),
        condition: 'new',
        isFeatured: 0,
        isNewArrival: 1,
        isBestSeller: 0,
        isActive: 1,
        tags: JSON.stringify(['HP', 'Pavilion', '15-inch', 'i7', 'Everyday']),
      },
      {
        name: 'HP EliteBook 840 G10',
        slug: 'hp-elitebook-840-g10',
        brand: 'HP',
        categoryId: laptopCategoryId,
        description: '14-inch premium business laptop with Intel Core i7 vPro, 32GB RAM, 512GB SSD, advanced security features',
        specifications: JSON.stringify({
          processor: 'Intel Core i7-1365U vPro',
          processorBrand: 'Intel',
          processorModel: 'i7-1365U',
          ram: '32GB',
          ramType: 'DDR5',
          storage: '512GB',
          storageType: 'NVMe',
          gpu: 'Intel Iris Xe Graphics',
          displaySize: '14"',
          displayResolution: '1920 x 1080',
          displayType: 'IPS Anti-glare',
          battery: '14 hours',
          ports: 'USB-C (x2), USB-A (x2), HDMI 2.1, Headphone Jack',
          os: 'Windows 11 Pro',
          weight: '1.38 kg',
          warranty: '3 years',
          color: 'Silver',
        }),
        retailPrice: 1799,
        wholesalePrice: 1599,
        wholesaleMinQty: 5,
        costPrice: 1000,
        stock: 10,
        lowStockThreshold: 3,
        images: JSON.stringify(['elitebook-840-g10.jpg', 'elitebook-angle.jpg']),
        condition: 'new',
        isFeatured: 1,
        isNewArrival: 1,
        isBestSeller: 0,
        isActive: 1,
        tags: JSON.stringify(['HP', 'EliteBook', 'Business', 'vPro', '14-inch']),
      },
      {
        name: 'HP Victus 16 Gaming',
        slug: 'hp-victus-16-gaming',
        brand: 'HP',
        categoryId: laptopCategoryId,
        description: '16.1-inch gaming laptop with AMD Ryzen 7, RTX 4060, 16GB RAM, 1TB SSD, 144Hz display',
        specifications: JSON.stringify({
          processor: 'AMD Ryzen 7 7840HS',
          processorBrand: 'AMD',
          processorModel: 'Ryzen 7 7840HS',
          ram: '16GB',
          ramType: 'DDR5',
          storage: '1TB',
          storageType: 'NVMe',
          gpu: 'NVIDIA GeForce RTX 4060',
          displaySize: '16.1"',
          displayResolution: '1920 x 1080',
          displayType: 'IPS 144Hz',
          battery: '8 hours',
          ports: 'USB-C, USB-A (x3), HDMI 2.1, Ethernet',
          os: 'Windows 11',
          weight: '2.48 kg',
          warranty: '1 year',
          color: 'Performance Blue',
        }),
        retailPrice: 1399,
        wholesalePrice: 1199,
        wholesaleMinQty: 5,
        costPrice: 800,
        stock: 7,
        lowStockThreshold: 2,
        images: JSON.stringify(['hp-victus-16.jpg', 'victus-kb.jpg']),
        condition: 'new',
        isFeatured: 0,
        isNewArrival: 1,
        isBestSeller: 0,
        isActive: 1,
        tags: JSON.stringify(['HP', 'Victus', 'Gaming', 'RTX 4060', '144Hz']),
      },
      {
        name: 'HP ProBook 450 G10',
        slug: 'hp-probook-450-g10',
        brand: 'HP',
        categoryId: laptopCategoryId,
        description: '15.6-inch business laptop, Intel Core i5, 16GB RAM, 512GB SSD, perfect for small to medium businesses',
        specifications: JSON.stringify({
          processor: 'Intel Core i5-1340P',
          processorBrand: 'Intel',
          processorModel: 'i5-1340P',
          ram: '16GB',
          ramType: 'DDR5',
          storage: '512GB',
          storageType: 'NVMe',
          gpu: 'Intel Iris Xe Graphics',
          displaySize: '15.6"',
          displayResolution: '1920 x 1080',
          displayType: 'IPS Anti-glare',
          battery: '11 hours',
          ports: 'USB-C, USB-A (x2), HDMI, RJ45 Ethernet',
          os: 'Windows 11 Pro',
          weight: '1.78 kg',
          warranty: '2 years',
          color: 'Natural Silver',
        }),
        retailPrice: 1099,
        wholesalePrice: 949,
        wholesaleMinQty: 5,
        costPrice: 600,
        stock: 22,
        lowStockThreshold: 5,
        images: JSON.stringify(['probook-450-g10.jpg', 'probook-top.jpg']),
        condition: 'new',
        isFeatured: 0,
        isNewArrival: 0,
        isBestSeller: 0,
        isActive: 1,
        tags: JSON.stringify(['HP', 'ProBook', 'Business', 'i5', '15-inch']),
      },
    ];

    // Additional Dell Products
    const dellLaptops = [
      {
        name: 'Dell Inspiron 16 Plus',
        slug: 'dell-inspiron-16-plus',
        brand: 'Dell',
        categoryId: laptopCategoryId,
        description: '16-inch 2K display, Intel Core i7, 16GB RAM, 1TB SSD, for creators and professionals',
        specifications: JSON.stringify({
          processor: 'Intel Core i7-13700H',
          processorBrand: 'Intel',
          processorModel: 'i7-13700H',
          ram: '16GB',
          ramType: 'DDR5',
          storage: '1TB',
          storageType: 'NVMe',
          gpu: 'NVIDIA GeForce RTX 3050',
          displaySize: '16"',
          displayResolution: '2560 x 1600',
          displayType: 'IPS 2K',
          battery: '12 hours',
          ports: 'USB-C (x2), USB-A (x2), HDMI 2.0, SD Card',
          os: 'Windows 11',
          weight: '2.0 kg',
          warranty: '1 year',
          color: 'Platinum Silver',
        }),
        retailPrice: 1299,
        wholesalePrice: 1149,
        wholesaleMinQty: 5,
        costPrice: 720,
        stock: 14,
        lowStockThreshold: 3,
        images: JSON.stringify(['dell-inspiron-16-plus.jpg', 'inspiron-16-side.jpg']),
        condition: 'new',
        isFeatured: 0,
        isNewArrival: 1,
        isBestSeller: 0,
        isActive: 1,
        tags: JSON.stringify(['Dell', 'Inspiron', '16-inch', 'Creator', 'RTX 3050']),
      },
      {
        name: 'Dell Precision 5570 Workstation',
        slug: 'dell-precision-5570',
        brand: 'Dell',
        categoryId: laptopCategoryId,
        description: '15.6-inch mobile workstation with Intel Core i9, NVIDIA RTX A2000, 32GB RAM, 1TB SSD, ISV certified',
        specifications: JSON.stringify({
          processor: 'Intel Core i9-13900H',
          processorBrand: 'Intel',
          processorModel: 'i9-13900H',
          ram: '32GB',
          ramType: 'DDR5 ECC',
          storage: '1TB',
          storageType: 'NVMe',
          gpu: 'NVIDIA RTX A2000 8GB',
          displaySize: '15.6"',
          displayResolution: '3840 x 2400',
          displayType: 'OLED UHD+',
          battery: '10 hours',
          ports: 'USB-C Thunderbolt 4 (x4), SD Card, HDMI',
          os: 'Windows 11 Pro',
          weight: '2.0 kg',
          warranty: '3 years',
          color: 'Titanium Gray',
        }),
        retailPrice: 2899,
        wholesalePrice: 2599,
        wholesaleMinQty: 5,
        costPrice: 1700,
        stock: 5,
        lowStockThreshold: 2,
        images: JSON.stringify(['precision-5570.jpg', 'precision-deck.jpg']),
        condition: 'new',
        isFeatured: 1,
        isNewArrival: 0,
        isBestSeller: 0,
        isActive: 1,
        tags: JSON.stringify(['Dell', 'Precision', 'Workstation', 'i9', 'RTX A2000']),
      },
      {
        name: 'Dell G15 Gaming Laptop',
        slug: 'dell-g15-gaming',
        brand: 'Dell',
        categoryId: laptopCategoryId,
        description: '15.6-inch 165Hz gaming display, AMD Ryzen 7, RTX 4060, 16GB RAM, 512GB SSD, Alienware-inspired thermal design',
        specifications: JSON.stringify({
          processor: 'AMD Ryzen 7 7840HS',
          processorBrand: 'AMD',
          processorModel: 'Ryzen 7 7840HS',
          ram: '16GB',
          ramType: 'DDR5',
          storage: '512GB',
          storageType: 'NVMe',
          gpu: 'NVIDIA GeForce RTX 4060',
          displaySize: '15.6"',
          displayResolution: '2560 x 1440',
          displayType: 'IPS QHD 165Hz',
          battery: '7 hours',
          ports: 'USB-C, USB-A (x3), HDMI 2.1, Ethernet, Headphone Jack',
          os: 'Windows 11',
          weight: '2.81 kg',
          warranty: '1 year',
          color: 'Dark Shadow Gray',
        }),
        retailPrice: 1199,
        wholesalePrice: 1049,
        wholesaleMinQty: 5,
        costPrice: 680,
        stock: 11,
        lowStockThreshold: 3,
        images: JSON.stringify(['dell-g15.jpg', 'g15-rgb.jpg']),
        condition: 'new',
        isFeatured: 0,
        isNewArrival: 1,
        isBestSeller: 1,
        isActive: 1,
        tags: JSON.stringify(['Dell', 'G15', 'Gaming', 'RTX 4060', '165Hz']),
      },
      {
        name: 'Dell Latitude 5540',
        slug: 'dell-latitude-5540',
        brand: 'Dell',
        categoryId: laptopCategoryId,
        description: '15.6-inch business laptop with Intel Core i7 vPro, 16GB RAM, 256GB SSD, enterprise-grade security',
        specifications: JSON.stringify({
          processor: 'Intel Core i7-1355U vPro',
          processorBrand: 'Intel',
          processorModel: 'i7-1355U',
          ram: '16GB',
          ramType: 'DDR5',
          storage: '256GB',
          storageType: 'NVMe',
          gpu: 'Intel Iris Xe Graphics',
          displaySize: '15.6"',
          displayResolution: '1920 x 1080',
          displayType: 'IPS Anti-glare',
          battery: '13 hours',
          ports: 'USB-C Thunderbolt 4, USB-A (x2), HDMI, RJ45, Headphone Jack',
          os: 'Windows 11 Pro',
          weight: '1.74 kg',
          warranty: '3 years',
          color: 'Titanium Gray',
        }),
        retailPrice: 1449,
        wholesalePrice: 1279,
        wholesaleMinQty: 5,
        costPrice: 800,
        stock: 16,
        lowStockThreshold: 4,
        images: JSON.stringify(['latitude-5540.jpg', 'latitude-open.jpg']),
        condition: 'new',
        isFeatured: 0,
        isNewArrival: 0,
        isBestSeller: 0,
        isActive: 1,
        tags: JSON.stringify(['Dell', 'Latitude', 'Business', 'vPro', '15-inch']),
      },
    ];

    // Insert HP products
    console.log('Adding HP products...');
    for (const product of hpLaptops) {
      // Check if slug already exists
      const existing = await pool.request()
        .input('slug', product.slug)
        .query('SELECT id FROM Products WHERE slug = @slug');

      if (existing.recordset.length > 0) {
        console.log(`  Skipping "${product.name}" — already exists`);
        continue;
      }

      const id = uuidv4();
      await pool.request()
        .input('id', id)
        .input('name', product.name)
        .input('slug', product.slug)
        .input('brand', product.brand)
        .input('categoryId', product.categoryId)
        .input('description', product.description)
        .input('specifications', product.specifications)
        .input('retailPrice', product.retailPrice)
        .input('wholesalePrice', product.wholesalePrice)
        .input('wholesaleMinQty', product.wholesaleMinQty)
        .input('costPrice', product.costPrice)
        .input('stock', product.stock)
        .input('lowStockThreshold', product.lowStockThreshold)
        .input('images', product.images)
        .input('condition', product.condition)
        .input('isFeatured', product.isFeatured)
        .input('isNewArrival', product.isNewArrival)
        .input('isBestSeller', product.isBestSeller)
        .input('isActive', product.isActive)
        .input('tags', product.tags)
        .query(`INSERT INTO Products (id, name, slug, brand, categoryId, description, specifications, retailPrice, wholesalePrice, wholesaleMinQty, costPrice, stock, lowStockThreshold, images, condition, isFeatured, isNewArrival, isBestSeller, isActive, tags, averageRating, numReviews, createdAt, updatedAt)
                VALUES (@id, @name, @slug, @brand, @categoryId, @description, @specifications, @retailPrice, @wholesalePrice, @wholesaleMinQty, @costPrice, @stock, @lowStockThreshold, @images, @condition, @isFeatured, @isNewArrival, @isBestSeller, @isActive, @tags, 0, 0, GETDATE(), GETDATE())`);

      console.log(`  ✓ Added "${product.name}" (PKR ${product.retailPrice})`);
    }

    // Insert Dell products
    console.log('Adding Dell products...');
    for (const product of dellLaptops) {
      // Check if slug already exists
      const existing = await pool.request()
        .input('slug', product.slug)
        .query('SELECT id FROM Products WHERE slug = @slug');

      if (existing.recordset.length > 0) {
        console.log(`  Skipping "${product.name}" — already exists`);
        continue;
      }

      const id = uuidv4();
      await pool.request()
        .input('id', id)
        .input('name', product.name)
        .input('slug', product.slug)
        .input('brand', product.brand)
        .input('categoryId', product.categoryId)
        .input('description', product.description)
        .input('specifications', product.specifications)
        .input('retailPrice', product.retailPrice)
        .input('wholesalePrice', product.wholesalePrice)
        .input('wholesaleMinQty', product.wholesaleMinQty)
        .input('costPrice', product.costPrice)
        .input('stock', product.stock)
        .input('lowStockThreshold', product.lowStockThreshold)
        .input('images', product.images)
        .input('condition', product.condition)
        .input('isFeatured', product.isFeatured)
        .input('isNewArrival', product.isNewArrival)
        .input('isBestSeller', product.isBestSeller)
        .input('isActive', product.isActive)
        .input('tags', product.tags)
        .query(`INSERT INTO Products (id, name, slug, brand, categoryId, description, specifications, retailPrice, wholesalePrice, wholesaleMinQty, costPrice, stock, lowStockThreshold, images, condition, isFeatured, isNewArrival, isBestSeller, isActive, tags, averageRating, numReviews, createdAt, updatedAt)
                VALUES (@id, @name, @slug, @brand, @categoryId, @description, @specifications, @retailPrice, @wholesalePrice, @wholesaleMinQty, @costPrice, @stock, @lowStockThreshold, @images, @condition, @isFeatured, @isNewArrival, @isBestSeller, @isActive, @tags, 0, 0, GETDATE(), GETDATE())`);

      console.log(`  ✓ Added "${product.name}" (PKR ${product.retailPrice})`);
    }

    console.log('\n✅ All new HP & Dell products added successfully!');
    console.log(`   HP products added: ${hpLaptops.length}`);
    console.log(`   Dell products added: ${dellLaptops.length}`);

    // Show total product count
    const countResult = await pool.request()
      .query(`SELECT COUNT(*) as total FROM Products`);
    console.log(`   Total products in database: ${countResult.recordset[0].total}`);

    process.exit(0);
  } catch (error) {
    console.error('Error adding products:', error);
    process.exit(1);
  }
};

addMoreProducts();
