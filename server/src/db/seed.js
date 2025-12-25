import { connectDatabase, getClient } from "./connection.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  try {
    await connectDatabase();
    const pool = getClient();

    // Read content.json
    const contentPath = path.join(__dirname, "../../../data/content.json");
    const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));

    // Seed categories
    console.log("🌱 Seeding categories...");
    for (const category of content.categories) {
      await pool.query(
        "INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING",
        [category.name, category.slug]
      );
    }
    console.log(`✅ Seeded ${content.categories.length} categories`);

    // Seed articles
    console.log("🌱 Seeding articles...");
    for (const article of content.articles) {
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
    }
    console.log(`✅ Seeded ${content.articles.length} articles`);

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
