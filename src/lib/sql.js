import { query as dbQuery, execute as dbExecute } from '@/lib/db';

/**
 * Field name mappings from Mongoose (used in route code) to SQL column names.
 */
const FIELD_MAP = {
  '_id': 'id',
  'user': 'userId',
  'category': 'categoryId',
  'product': 'productId',
  'parent': 'parentId',
};

function mapField(field) {
  return FIELD_MAP[field] || field;
}

/**
 * Convert a dot-path like 'specifications.ram' to a SQL Server JSON expression.
 */
function mapDotPath(field) {
  const parts = field.split('.');
  if (parts.length === 1) return mapField(field);
  // e.g. specifications.ram -> JSON_VALUE(specifications, '$.ram')
  const root = mapField(parts[0]);
  const path = '$.' + parts.slice(1).join('.');
  return `JSON_VALUE(${root}, '${path}')`;
}

/**
 * Build a WHERE clause + params from a simple conditions object.
 * Returns { clause: string, params: object }
 */
export function buildWhere(conditions) {
  if (!conditions || Object.keys(conditions).length === 0)
    return { clause: '', params: {} };

  const parts = [];
  const params = {};
  let idx = 0;

  for (let [key, value] of Object.entries(conditions)) {
    if (value === undefined || value === null) continue;

    // $or — array of sub-conditions
    if (key === '$or' && Array.isArray(value)) {
      const orParts = value.map((sub) => {
        const r = buildWhere(sub);
        Object.assign(params, r.params);
        return r.clause.replace(/^WHERE\s+/i, '');
      });
      parts.push(`(${orParts.join(' OR ')})`);
      continue;
    }

    // $text search — fallback to LIKE on name
    if (key === '$text' && value?.$search) {
      const p = `_p${idx++}`;
      parts.push(`(name LIKE @${p} OR brand LIKE @${p})`);
      params[p] = `%${value.$search}%`;
      continue;
    }

    // $expr — direct SQL expression
    if (key === '$expr') {
      // Extract from { $lte: ['$stock', '$lowStockThreshold'] }
      if (value?.$lte && Array.isArray(value.$lte)) {
        const left = value.$lte[0].replace('$', '');
        const right = value.$lte[1].replace('$', '');
        parts.push(`${left} <= ${right}`);
      }
      continue;
    }

    // Handle operator objects: { $gte, $lte }, { $regex }, { $in }, { $ne }
    if (value && typeof value === 'object') {
      // $gte / $lte
      if ('$gte' in value || '$lte' in value) {
        const mapped = mapField(key);
        if (value.$gte !== undefined) {
          const p = `_p${idx++}`;
          parts.push(`${mapped} >= @${p}`);
          params[p] = value.$gte;
        }
        if (value.$lte !== undefined) {
          const p = `_p${idx++}`;
          parts.push(`${mapped} <= @${p}`);
          params[p] = value.$lte;
        }
        continue;
      }

      // $regex
      if ('$regex' in value) {
        const mapped = key.includes('.') ? mapDotPath(key) : mapField(key);
        const p = `_p${idx++}`;
        parts.push(`${mapped} LIKE @${p}`);
        params[p] = `%${value.$regex}%`;
        continue;
      }

      // $in — only at top level on 'role' or similar
      if ('$in' in value && Array.isArray(value.$in)) {
        const mapped = mapField(key);
        const list = value.$in.map((v, i) => {
          const p = `_p${idx++}`;
          params[p] = v;
          return `@${p}`;
        });
        parts.push(`${mapped} IN (${list.join(', ')})`);
        continue;
      }

      // $ne
      if ('$ne' in value) {
        const mapped = mapField(key);
        const p = `_p${idx++}`;
        parts.push(`${mapped} != @${p}`);
        params[p] = value.$ne;
        continue;
      }

      continue;
    }

    // Simple equality
    const isBoolean = typeof value === 'boolean';
    const isNumber = typeof value === 'number';
    const mapped = key.includes('.') ? mapDotPath(key) : mapField(key);
    const p = `_p${idx++}`;

    if (isBoolean) {
      parts.push(`${mapped} = @${p}`);
      params[p] = value ? 1 : 0;
    } else if (isNumber) {
      parts.push(`${mapped} = @${p}`);
      params[p] = value;
    } else {
      parts.push(`${mapped} = @${p}`);
      params[p] = value;
    }
  }

  return {
    clause: parts.length > 0 ? 'WHERE ' + parts.join(' AND ') : '',
    params,
  };
}

/**
 * Build ORDER BY clause from a sort object like { createdAt: -1 } or { name: 1 }.
 */
export function buildOrderBy(sort) {
  if (!sort) return '';
  const entries = Object.entries(sort);
  if (entries.length === 0) return '';
  const parts = entries.map(([key, dir]) => {
    const mapped = mapField(key);
    return `${mapped} ${dir === -1 ? 'DESC' : 'ASC'}`;
  });
  return 'ORDER BY ' + parts.join(', ');
}

/**
 * Handle Mongoose-style .select() strings:
 *   '-password'        → exclude password
 *   'name slug images' → only those columns
 */
export function buildSelect(selectStr) {
  if (!selectStr || selectStr === '*') return '*';
  const parts = selectStr.split(/\s+/).filter(Boolean);
  const includes = [];
  const excludes = [];

  for (const p of parts) {
    if (p.startsWith('-')) excludes.push(p.slice(1));
    else includes.push(mapField(p));
  }

  if (includes.length > 0) return includes.join(', ');
  // if only exclusions, assume SELECT *, then handle in result processing
  return '*';
}

/**
 * SQL helpers for common CRUD operations.
 * Routes that need complex queries should use raw SQL via db.js directly.
 */
export const sql = {
  async findAll(table, conditions = {}, options = {}) {
    const { sort = { createdAt: -1 }, skip = 0, limit = null, select = '*' } = options;
    const { clause, params } = buildWhere(conditions);
    const orderBy = buildOrderBy(sort);
    const cols = buildSelect(select);

    let sqlQuery = `SELECT ${cols} FROM ${table} ${clause} ${orderBy}`;

    if (limit) {
      sqlQuery = `SELECT ${cols} FROM ${table} ${clause} ${orderBy} OFFSET @_offset ROWS FETCH NEXT @_limit ROWS ONLY`;
      params._offset = skip;
      params._limit = limit;
    }

    return dbQuery(sqlQuery.replace(/\s+/g, ' ').trim(), params);
  },

  async findOne(table, conditions = {}, options = {}) {
    const { select = '*' } = options;
    const { clause, params } = buildWhere(conditions);
    const cols = buildSelect(select);
    const rows = await dbQuery(
      `SELECT TOP 1 ${cols} FROM ${table} ${clause}`,
      params
    );
    return rows[0] || null;
  },

  async findById(table, id) {
    return sql.findOne(table, { id });
  },

  async count(table, conditions = {}) {
    const { clause, params } = buildWhere(conditions);
    const rows = await dbQuery(
      `SELECT COUNT(*) as count FROM ${table} ${clause}`,
      params
    );
    return rows[0]?.count || 0;
  },

  async create(table, data) {
    const { v4: uuidv4 } = await import('uuid');
    const id = data.id || uuidv4();
    const now = new Date().toISOString();

    const record = { ...data, id, createdAt: now, updatedAt: now };
    // Map fields
    const mapped = {};
    for (const [k, v] of Object.entries(record)) {
      mapped[mapField(k)] = v;
    }

    const keys = Object.keys(mapped);
    const params = {};
    keys.forEach((k) => { params[k] = mapped[k]; });

    await dbExecute(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(k => `@${k}`).join(', ')})`,
      params
    );
    return mapped;
  },

  async update(table, id, data) {
    const now = new Date().toISOString();
    data.updatedAt = now;

    const mapped = {};
    for (const [k, v] of Object.entries(data)) {
      if (k === 'id' || k === '_id') continue;
      mapped[mapField(k)] = v;
    }

    const setClause = Object.keys(mapped).map(k => `${k} = @${k}`).join(', ');
    await dbExecute(`UPDATE ${table} SET ${setClause} WHERE id = @_id`, {
      ...mapped,
      _id: id,
    });
    return sql.findById(table, id);
  },

  async delete(table, id) {
    await dbExecute(`DELETE FROM ${table} WHERE id = @_id`, { _id: id });
    return true;
  },

  async findByIdAndUpdate(table, id, data) {
    return sql.update(table, id, data);
  },

  async findByIdAndDelete(table, id) {
    return sql.delete(table, id);
  },

  async findOneAndUpdate(table, conditions, data, options = {}) {
    const existing = await sql.findOne(table, conditions);
    if (!existing) {
      if (options.upsert) {
        return sql.create(table, { ...conditions, ...data });
      }
      return null;
    }
    return sql.update(table, existing.id, data);
  },

  async insertMany(table, records) {
    const results = [];
    for (const r of records) results.push(await sql.create(table, r));
    return results;
  },

  async deleteMany(table, conditions = {}) {
    const { clause, params } = buildWhere(conditions);
    if (clause) {
      await dbExecute(`DELETE FROM ${table} ${clause}`, params);
    } else {
      await dbExecute(`DELETE FROM ${table}`);
    }
    return true;
  },
};

export default sql;

// Re-export raw query functions
export const query = dbQuery;
export const execute = dbExecute;
