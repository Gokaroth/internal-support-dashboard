import knex from 'knex';
import { config } from './environment.js';
import logger from '../utils/logger.js';

const dbConfig = {
  client: config.db.client,
  connection: config.db.connection,
  useNullAsDefault: true,
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  debug: config.env === 'development'
};

const db = knex(dbConfig);

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    logger.info('Database connection established successfully');
  })
  .catch(err => {
    logger.error('Database connection failed:', err);
    process.exit(1);
  });

export default db;
