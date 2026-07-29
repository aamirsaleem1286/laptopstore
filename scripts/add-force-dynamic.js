import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

function findRouteFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findRouteFiles(fullPath));
    } else if (entry.name === 'route.js') {
      results.push(fullPath);
    }
  }
  return results;
}

const files = findRouteFiles(apiDir);
let added = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('force-dynamic')) {
    // Add force-dynamic after the last import statement
    const importMatch = content.match(/^import .+$/m);
    if (importMatch) {
      content = content.replace(
        /^(import .+)$/m,
        '$1\n\nexport const dynamic = \'force-dynamic\';'
      );
    } else {
      content = `export const dynamic = 'force-dynamic';\n\n${content}`;
    }
    fs.writeFileSync(file, content);
    console.log(`✅ Added force-dynamic: ${path.relative(apiDir.replace(/\\api$/, ''), file)}`);
    added++;
  } else {
    console.log(`⏭️ Already has force-dynamic: ${path.relative(apiDir.replace(/\\api$/, ''), file)}`);
  }
}

console.log(`\n📊 Total: ${files.length} route files, ${added} updated`);
