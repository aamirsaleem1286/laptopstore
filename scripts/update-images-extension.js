import { getPool } from '../src/lib/db.js';

async function main() {
  const pool = await getPool();

  // Update .jpg to .svg in images column
  const result = await pool.request()
    .query("UPDATE Products SET images = REPLACE(images, '.jpg', '.svg') WHERE images LIKE '%.jpg%'");

  console.log(`✅ Updated ${result.rowsAffected[0]} products - replaced .jpg with .svg in images`);

  const check = await pool.request().query('SELECT COUNT(*) as total FROM Products');
  console.log('Total products:', check.recordset[0].total);

  const sample = await pool.request().query("SELECT TOP 3 name, images FROM Products");
  sample.recordset.forEach(p => console.log(' ', p.name, '→', p.images));

  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
