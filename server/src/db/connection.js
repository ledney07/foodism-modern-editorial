import pg from "pg";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local first (for local overrides), then fall back to .env
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") }); // Fallback to .env

const { Pool } = pg;

// PostgreSQL connection pool
let pgPool = null;

// Initialize PostgreSQL connection pool
async function initializePostgreSQLPool() {
  if (pgPool) return pgPool;

  const host = process.env.DB_HOST || process.env.PGHOST || "localhost";
  const port = parseInt(process.env.DB_PORT || process.env.PGPORT || "5432");
  const database =
    process.env.DB_NAME || process.env.PGDATABASE || "foodism_db";
  const user = process.env.DB_USER || process.env.PGUSER || "postgres";
  const password = process.env.DB_PASSWORD || process.env.PGPASSWORD;
  const sslEnabled =
    process.env.DB_SSL === "true" || process.env.PGSSLMODE === "require";
  const awsRoleArn = process.env.AWS_ROLE_ARN;
  const awsRegion = process.env.AWS_REGION || "us-east-1";

  // Determine if we should use IAM authentication (Vercel) or password authentication
  const useIAMAuth = awsRoleArn && !password && process.env.PGHOST;

  let poolConfig = {
    host,
    port,
    database,
    user,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  if (useIAMAuth) {
    // Use IAM authentication for Vercel/AWS Aurora PostgreSQL
    try {
      // Dynamic imports for Vercel-specific packages (only available in Vercel runtime)
      const { Signer } = await import("@aws-sdk/rds-signer");
      const { awsCredentialsProvider } = await import(
        "@vercel/oidc-aws-credentials-provider"
      );

      const signer = new Signer({
        hostname: host,
        port: port,
        username: user,
        region: awsRegion,
        credentials: awsCredentialsProvider({
          roleArn: awsRoleArn,
          clientConfig: { region: awsRegion },
        }),
      });

      // Use function for password (as per Vercel example)
      // The signer.getAuthToken() returns a Promise<string>
      poolConfig.password = () => signer.getAuthToken();

      pgPool = new Pool(poolConfig);

      // Attach to Vercel functions runtime if available
      try {
        const { attachDatabasePool } = await import("@vercel/functions");
        attachDatabasePool(pgPool);
        console.log("✅ Attached database pool to Vercel functions runtime");
      } catch (e) {
        // Not in Vercel runtime, proceed normally
        console.log(
          "Running outside Vercel runtime, skipping attachDatabasePool"
        );
      }
    } catch (error) {
      console.warn(
        "IAM authentication not available, falling back to password:",
        error.message
      );
      // Fallback to password authentication
      poolConfig.password = password || "postgres";
      pgPool = new Pool(poolConfig);
    }
  } else {
    // Use password authentication (local development or standard setup)
    poolConfig.password = password || "postgres";
    pgPool = new Pool(poolConfig);
  }

  pgPool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
    process.exit(-1);
  });

  return pgPool;
}

// Initialize pool synchronously for password auth
// IAM auth will be initialized lazily in connectDatabase()
if (process.env.DB_TYPE !== "mongodb") {
  const host = process.env.DB_HOST || process.env.PGHOST;
  const awsRoleArn = process.env.AWS_ROLE_ARN;
  const password = process.env.DB_PASSWORD || process.env.PGPASSWORD;

  // Only initialize synchronously if we have a password (not IAM auth)
  if (password || !awsRoleArn || !host) {
    const port = parseInt(process.env.DB_PORT || process.env.PGPORT || "5432");
    const database =
      process.env.DB_NAME || process.env.PGDATABASE || "foodism_db";
    const user = process.env.DB_USER || process.env.PGUSER || "postgres";
    const sslEnabled =
      process.env.DB_SSL === "true" || process.env.PGSSLMODE === "require";

    pgPool = new Pool({
      host: host || "localhost",
      port,
      database,
      user,
      password: password || "postgres",
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pgPool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL client", err);
      process.exit(-1);
    });
  }
}

// MongoDB connection (alternative option)
let mongooseConnection = null;
if (process.env.DB_TYPE === "mongodb") {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/foodism_db";

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });
}

export async function connectDatabase() {
  if (process.env.DB_TYPE === "mongodb") {
    mongooseConnection = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/foodism_db"
    );
    return mongooseConnection;
  } else {
    // Initialize pool if not already initialized (for IAM auth)
    if (!pgPool) {
      pgPool = await initializePostgreSQLPool();
    }

    // Test PostgreSQL connection
    const client = await pgPool.connect();
    try {
      await client.query("SELECT NOW()");
      return pgPool;
    } finally {
      client.release();
    }
  }
}

export function getDatabase() {
  if (process.env.DB_TYPE === "mongodb") {
    return mongoose.connection;
  }
  // If pool not initialized (IAM auth), it will be initialized in connectDatabase()
  // For now, return null and let connectDatabase() handle initialization
  if (!pgPool) {
    throw new Error(
      "Database pool not initialized. Call connectDatabase() first."
    );
  }
  return pgPool;
}

export function getClient() {
  if (process.env.DB_TYPE === "mongodb") {
    return mongoose;
  }
  // If pool not initialized (IAM auth), it will be initialized in connectDatabase()
  if (!pgPool) {
    throw new Error(
      "Database pool not initialized. Call connectDatabase() first."
    );
  }
  return pgPool;
}
