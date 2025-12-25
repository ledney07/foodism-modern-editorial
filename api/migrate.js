import { connectDatabase, getClient } from '../server/src/db/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // Simple auth check (in production, use proper authentication)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Add a secret key for security
  const authKey = req.headers['x-auth-key'];
  if (authKey !== process.env.MIGRATE_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectDatabase();
    const pool = getClient();

    // Read schema.sql
    const schemaPath = path.join(__dirname, '../server/src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema
    console.log('🔄 Running database migrations...');
    await pool.query(schema);
    console.log('✅ Database migrations completed successfully!');

    res.status(200).json({ 
      success: true, 
      message: 'Database migrations completed successfully!' 
    });
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    res.status(500).json({ 
      error: 'Migration failed', 
      message: error.message 
    });
  }
}

