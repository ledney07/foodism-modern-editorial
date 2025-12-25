import { connectDatabase, getClient } from "./connection.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    await connectDatabase();
    const pool = getClient();

    // Read schema.sql
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Execute schema
    console.log("🔄 Running database migrations...");
    await pool.query(schema);
    console.log("✅ Database migrations completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    process.exit(1);
  }
}

runMigrations();
