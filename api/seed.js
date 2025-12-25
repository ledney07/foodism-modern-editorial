import { connectDatabase, getClient } from '../server/src/db/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
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

    // Read content.json
    const contentPath = path.join(__dirname, '../data/content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

    // Seed categories
    console.log('🌱 Seeding categories...');
    for (const category of content.categories) {
      await pool.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING',
        [category.name, category.slug]
      );
    }
    console.log(`✅ Seeded ${content.categories.length} categories`);

    // Seed articles
    console.log('🌱 Seeding articles...');
    let seededCount = 0;
    for (const article of content.articles) {
      try {
        await pool.query(
          `INSERT INTO articles (
            title, excerpt, content, author, date, category,
            image, read_time, trending, tags, takeaways
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (title, author, date) DO NOTHING`,
          [
            article.title,
            article.excerpt,
            article.content,
            article.author,
            article.date,
            article.category,
            article.image,
            article.readTime,
            article.trending || false,
            article.tags || [],
            article.takeaways || [],
          ]
        );
        seededCount++;
      } catch (err) {
        console.warn(`⚠️  Skipped article "${article.title}":`, err.message);
      }
    }
    console.log(`✅ Seeded ${seededCount} articles`);

    res.status(200).json({ 
      success: true, 
      message: `Seeded ${content.categories.length} categories and ${seededCount} articles` 
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({ 
      error: 'Seeding failed', 
      message: error.message 
    });
  }
}

