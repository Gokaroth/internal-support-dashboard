import db from '../config/database.js';
import logger from '../utils/logger.js';

export async function up() {
  try {
    logger.info('Creating tickets table...');

    await db.schema.createTable('tickets', (table) => {
      // Primary key - auto-increment integer
      table.increments('id').primary();

      // Ticket fields matching frontend expectations
      table.string('title', 255).notNullable();
      table.string('issueType', 100).notNullable();
      table.enum('priority', ['Low', 'Medium', 'High', 'Critical']).defaultTo('Low');
      table.string('team', 50).notNullable();
      table.enum('status', ['Open', 'In Progress', 'Resolved', 'Closed']).defaultTo('Open');
      table.text('description').notNullable();

      // Submitter information
      table.string('submitterName', 255).notNullable();
      table.string('submitterEmail', 255).notNullable();

      // Assignment
      table.string('assignedMember', 255);

      // Timestamps - using snake_case for backend, will map to camelCase for frontend
      table.timestamp('created_at').defaultTo(db.fn.now()).notNullable();
      table.timestamp('updated_at').defaultTo(db.fn.now()).notNullable();

      // Indexes for performance
      table.index(['status', 'team', 'priority']);
      table.index('created_at');
      table.index('submitterEmail');
    });

    // Create trigger for updated_at timestamp (PostgreSQL)
    if (db.client.config.client === 'pg') {
      await db.raw(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);

      await db.raw(`
        CREATE TRIGGER update_tickets_updated_at
        BEFORE UPDATE ON tickets
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    logger.info('Tickets table created successfully');

    // Insert sample data for development
    if (process.env.NODE_ENV === 'development') {
      logger.info('Inserting sample data...');

      await db('tickets').insert([
        {
          title: 'Login page not responding',
          issueType: 'Bug',
          priority: 'High',
          team: 'dev',
          status: 'In Progress',
          description: 'Users are unable to log in to the application. The login page becomes unresponsive after clicking submit.',
          submitterName: 'John Doe',
          submitterEmail: 'john.doe@company.com',
          assignedMember: 'Alice Johnson',
          created_at: new Date('2025-01-15T10:30:00Z'),
          updated_at: new Date('2025-01-15T14:22:00Z')
        },
        {
          title: 'Add dark mode feature',
          issueType: 'Feature Request',
          priority: 'Medium',
          team: 'product',
          status: 'Open',
          description: 'Users have requested a dark mode option for better usability in low-light environments.',
          submitterName: 'Sarah Wilson',
          submitterEmail: 'sarah.wilson@company.com',
          assignedMember: 'Noah Davis',
          created_at: new Date('2025-01-14T16:45:00Z'),
          updated_at: new Date('2025-01-14T16:45:00Z')
        }
      ]);

      logger.info('Sample data inserted successfully');
    }

  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

export async function down() {
  try {
    logger.info('Dropping tickets table...');

    // Drop trigger first (PostgreSQL)
    if (db.client.config.client === 'pg') {
      await db.raw('DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets');
      await db.raw('DROP FUNCTION IF EXISTS update_updated_at_column()');
    }

    await db.schema.dropTableIfExists('tickets');
    logger.info('Tickets table dropped successfully');
  } catch (error) {
    logger.error('Migration rollback failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await up();
    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}
