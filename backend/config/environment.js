// ────────────────────────────────────────────────────────────────────────────
// Environment & Path Helpers
// ────────────────────────────────────────────────────────────────────────────
import dotenv from 'dotenv';
import path   from 'path';
import { fileURLToPath } from 'url';

dotenv.config();                                       // load .env first

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ────────────────────────────────────────────────────────────────────────────
// Database Settings: SQLite for dev, PostgreSQL for prod
// ────────────────────────────────────────────────────────────────────────────
const DB_CLIENT      = process.env.DB_CLIENT || 'pg';
const sqliteFilename = path.join(__dirname, '..', 'tickets.sqlite'); // ← one level up

const dbConnection =
DB_CLIENT === 'sqlite3'
? { filename: sqliteFilename }
: process.env.DB_CONNECTION || {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT, 10) || 5432,
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'bunq_tickets',
  ssl: process.env.NODE_ENV === 'production'
  ? { rejectUnauthorized: false }
  : false
};

// ────────────────────────────────────────────────────────────────────────────
// Final Config Object
// ────────────────────────────────────────────────────────────────────────────
export const config = {
  env:  process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,

  db: {
    client: DB_CLIENT,
    connection: dbConnection,
    ...(DB_CLIENT === 'sqlite3' && { useNullAsDefault: true }) // only for SQLite
  },

  // Security
  jwt: {
    secret:    process.env.JWT_SECRET    || 'fallback-dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max:      parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS, 10) || 100
  },

  // Slack Integration
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    enabled:    process.env.SLACK_ENABLED === 'true'
  },

  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:8080','http://10.8.0.1:3000']
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file:  process.env.LOG_FILE  || './logs/app.log'
  }
};

export default config;
