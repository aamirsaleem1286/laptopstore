import sql from 'mssql';

const sqlConfig = {
  user: process.env.SQL_USER || 'sa',
  password: process.env.SQL_PASSWORD || 'P@ssW0rd1',
  server: process.env.SQL_SERVER || 'localhost',
  database: process.env.SQL_DATABASE || 'laptopstore',
  port: parseInt(process.env.SQL_PORT || '1433'),
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

export async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(sqlConfig);
  console.log('Connected to SQL Server');
  return pool;
}

// Keep dbConnect for backwards compatibility with existing route imports
export async function dbConnect() {
  await getPool();
  return true;
}

export async function query(sqlQuery, params = {}) {
  const p = await getPool();
  const request = p.request();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      request.input(key, value);
    }
  });
  const result = await request.query(sqlQuery);
  return result.recordset;
}

export async function execute(sqlQuery, params = {}) {
  const p = await getPool();
  const request = p.request();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      request.input(key, value);
    }
  });
  const result = await request.query(sqlQuery);
  return result;
}

export async function transaction(callback) {
  const p = await getPool();
  const tx = new sql.Transaction(p);
  try {
    await tx.begin();
    const result = await callback(tx);
    await tx.commit();
    return result;
  } catch (error) {
    await tx.rollback();
    throw error;
  }
}

export default { query, execute, transaction, getPool, dbConnect };
