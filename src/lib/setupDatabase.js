import { getPool } from '@/lib/db';
import createTables from '@/lib/createTables';
import migrateData from '@/lib/migrateData';

const setupDatabase = async () => {
  try {
    console.log('Setting up SQL Server database...');

    // Test connection
    console.log('Testing connection...');
    await getPool();
    console.log('Connection successful!');

    // Create tables
    console.log('Creating tables...');
    await createTables();

    // Optionally migrate data (uncomment if you have data files)
    // console.log('Migrating data...');
    // await migrateData();

    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();