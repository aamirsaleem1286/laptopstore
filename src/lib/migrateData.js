/*
Migration script to convert MongoDB data to SQL Server
Run this script AFTER creating the tables in SQL Server
*/

import { execute, query } from '@/lib/db';
import users from '@/data/users.json';
import categories from '@/data/categories.json';
import products from '@/data/products.json';
import coupons from '@/data/coupons.json';
import banners from '@/data/banners.json';

const migrateData = async () => {
  try {
    console.log('Starting data migration...');

    // Migrate Users
    console.log('Migrating users...');
    for (const user of users) {
      await execute(
        `INSERT INTO Users (id, name, email, password, role, wholesaleStatus, businessName, phone, addresses, isBlocked, resetPasswordToken, resetPasswordExpires, createdAt, updatedAt)
         VALUES (@id, @name, @email, @password, @role, @wholesaleStatus, @businessName, @phone, @addresses, @isBlocked, @resetPasswordToken, @resetPasswordExpires, @createdAt, @updatedAt)
         ON CONFLICT (id) DO NOTHING`,
        user
      );
    }

    // Migrate Categories
    console.log('Migrating categories...');
    for (const category of categories) {
      await execute(
        `INSERT INTO Categories (id, name, slug, image, parentId, isActive, createdAt, updatedAt)
         VALUES (@id, @name, @slug, @image, @parentId, @isActive, @createdAt, @updatedAt)
         ON CONFLICT (id) DO NOTHING`,
        category
      );
    }

    // Migrate Products
    console.log('Migrating products...');
    for (const product of products) {
      await execute(
        `INSERT INTO Products (id, name, slug, brand, categoryId, description, specifications, retailPrice, wholesalePrice, wholesaleMinQty, costPrice, stock, lowStockThreshold, images, condition, isFeatured, isNewArrival, isBestSeller, isActive, tags, averageRating, numReviews, createdAt, updatedAt)
         VALUES (@id, @name, @slug, @brand, @categoryId, @description, @specifications, @retailPrice, @wholesalePrice, @wholesaleMinQty, @costPrice, @stock, @lowStockThreshold, @images, @condition, @isFeatured, @isNewArrival, @isBestSeller, @isActive, @tags, @averageRating, @numReviews, @createdAt, @updatedAt)
         ON CONFLICT (id) DO NOTHING`,
        product
      );
    }

    // Migrate Coupons
    console.log('Migrating coupons...');
    for (const coupon of coupons) {
      await execute(
        `INSERT INTO Coupons (id, code, type, description, value, minOrderAmount, maxUses, usedCount, isActive, startDate, expiresAt, appliesTo, createdAt, updatedAt)
         VALUES (@id, @code, @type, @description, @value, @minOrderAmount, @maxUses, @usedCount, @isActive, @startDate, @expiresAt, @appliesTo, @createdAt, @updatedAt)
         ON CONFLICT (id) DO NOTHING`,
        coupon
      );
    }

    // Migrate Banners
    console.log('Migrating banners...');
    for (const banner of banners) {
      await execute(
        `INSERT INTO Banners (id, title, subtitle, image, link, position, isActive, createdAt, updatedAt)
         VALUES (@id, @title, @subtitle, @image, @link, @position, @isActive, @createdAt, @updatedAt)
         ON CONFLICT (id) DO NOTHING`,
        banner
      );
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during data migration:', error);
    throw error;
  }
};

export default migrateData;
