import { connectDatabase, getClient } from '../server/src/db/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel serverless function handler
export default async function handler(req, res) {
  // Simple auth check (in production, use proper authentication)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Add a secret key for security
  const authKey = req.headers['x-auth-key'] || req.headers['X-Auth-Key'];
  const secretKey = process.env.MIGRATE_SECRET_KEY;
  
  if (secretKey && authKey !== secretKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔄 Starting database migrations...');
    await connectDatabase();
    const pool = await getClient();

    // Read schema.sql
    const schemaPath = path.join(__dirname, '../server/src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema
    console.log('🔄 Running database migrations...');
    await pool.query(schema);
    console.log('✅ Database migrations completed successfully!');

    return res.status(200).json({ 
      success: true, 
      message: 'Database migrations completed successfully!' 
    });
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    return res.status(500).json({ 
      error: 'Migration failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
