import db from '../config/database.js';
import logger from '../utils/logger.js';
import { formatTicketId } from '../utils/id.utils.js';
import { formatDatesForFrontend, formatDatesForDatabase } from '../utils/date.utils.js';

class TicketModel {
  constructor() {
    this.table = 'tickets';
  }

  // Transform database row to frontend format
  transformForFrontend(ticket) {
    if (!ticket) return null;

    return {
      // Format ID as TKT-001 for frontend compatibility
      id: formatTicketId(ticket.id),
      title: ticket.title,
      issueType: ticket.issueType,
      priority: ticket.priority,
      team: ticket.team,
      status: ticket.status,
      description: ticket.description,
      submitterName: ticket.submitterName,
      submitterEmail: ticket.submitterEmail,
      assignedMember: ticket.assignedMember,
      // Convert snake_case timestamps to camelCase Date objects
      ...formatDatesForFrontend(ticket)
    };
  }

  // Transform frontend data to database format
  transformForDatabase(ticketData) {
    const transformed = {
      title: ticketData.title,
      issueType: ticketData.issueType,
      priority: ticketData.priority,
      team: ticketData.team,
      status: ticketData.status,
      description: ticketData.description,
      submitterName: ticketData.submitterName,
      submitterEmail: ticketData.submitterEmail,
      assignedMember: ticketData.assignedMember
    };

    // Convert dates if provided
    if (ticketData.createdDate || ticketData.lastUpdated) {
      Object.assign(transformed, formatDatesForDatabase(ticketData));
    }

    return transformed;
  }

  // Get all tickets with optional filtering
  async findAll(filters = {}) {
    try {
      let query = db(this.table);

      // Apply filters
      if (filters.status) {
        query = query.where('status', filters.status);
      }

      if (filters.team) {
        query = query.where('team', filters.team);
      }

      if (filters.priority) {
        query = query.where('priority', filters.priority);
      }

      if (filters.search) {
        query = query.where(function() {
          this.where('title', 'ilike', `%${filters.search}%`)
              .orWhere('description', 'ilike', `%${filters.search}%`)
              .orWhere('submitterName', 'ilike', `%${filters.search}%`);
        });
      }

      // Order by creation date (newest first)
      query = query.orderBy('created_at', 'desc');

      const tickets = await query;

      // Transform all tickets for frontend
      return tickets.map(ticket => this.transformForFrontend(ticket));

    } catch (error) {
      logger.error('Error fetching tickets:', error);
      throw new Error('Failed to fetch tickets');
    }
  }

  // Get single ticket by database ID
  async findById(id) {
    try {
      const ticket = await db(this.table)
        .where('id', id)
        .first();

      return this.transformForFrontend(ticket);
    } catch (error) {
      logger.error(`Error fetching ticket with id ${id}:`, error);
      throw new Error('Failed to fetch ticket');
    }
  }

  // Get single ticket by frontend ID format (TKT-001)
  async findByTicketId(ticketId) {
    try {
      // Extract numeric ID from TKT-001 format
      const numericId = parseInt(ticketId.replace('TKT-', ''));
      if (isNaN(numericId)) {
        throw new Error('Invalid ticket ID format');
      }

      return await this.findById(numericId);
    } catch (error) {
      logger.error(`Error fetching ticket with ticketId ${ticketId}:`, error);
      throw new Error('Failed to fetch ticket');
    }
  }

  // Create new ticket
  async create(ticketData) {
    try {
      const transformedData = this.transformForDatabase(ticketData);

      const [insertedTicket] = await db(this.table)
        .insert(transformedData)
        .returning('*');

      logger.info(`Ticket created with ID: ${insertedTicket.id}`);

      return this.transformForFrontend(insertedTicket);
    } catch (error) {
      logger.error('Error creating ticket:', error);
      throw new Error('Failed to create ticket');
    }
  }

  // Update ticket by database ID
  async updateById(id, updateData) {
    try {
      const transformedData = this.transformForDatabase(updateData);
      transformedData.updated_at = new Date();

      const [updatedTicket] = await db(this.table)
        .where('id', id)
        .update(transformedData)
        .returning('*');

      if (!updatedTicket) {
        throw new Error('Ticket not found');
      }

      logger.info(`Ticket updated with ID: ${id}`);

      return this.transformForFrontend(updatedTicket);
    } catch (error) {
      logger.error(`Error updating ticket with id ${id}:`, error);
      throw new Error('Failed to update ticket');
    }
  }

  // Update ticket by frontend ID format
  async updateByTicketId(ticketId, updateData) {
    try {
      const numericId = parseInt(ticketId.replace('TKT-', ''));
      if (isNaN(numericId)) {
        throw new Error('Invalid ticket ID format');
      }

      return await this.updateById(numericId, updateData);
    } catch (error) {
      logger.error(`Error updating ticket with ticketId ${ticketId}:`, error);
      throw new Error('Failed to update ticket');
    }
  }

  // Delete ticket by database ID
  async deleteById(id) {
    try {
      const deletedCount = await db(this.table)
        .where('id', id)
        .del();

      if (deletedCount === 0) {
        throw new Error('Ticket not found');
      }

      logger.info(`Ticket deleted with ID: ${id}`);

      return { success: true, deletedId: id };
    } catch (error) {
      logger.error(`Error deleting ticket with id ${id}:`, error);
      throw new Error('Failed to delete ticket');
    }
  }

  // Delete ticket by frontend ID format
  async deleteByTicketId(ticketId) {
    try {
      const numericId = parseInt(ticketId.replace('TKT-', ''));
      if (isNaN(numericId)) {
        throw new Error('Invalid ticket ID format');
      }

      return await this.deleteById(numericId);
    } catch (error) {
      logger.error(`Error deleting ticket with ticketId ${ticketId}:`, error);
      throw new Error('Failed to delete ticket');
    }
  }

  // Get ticket statistics
  async getStats() {
    try {
      const stats = await db(this.table)
        .select(
          db.raw('COUNT(*) as total'),
          db.raw("COUNT(CASE WHEN status = 'Open' THEN 1 END) as open"),
          db.raw("COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as inProgress"),
          db.raw("COUNT(CASE WHEN status = 'Resolved' THEN 1 END) as resolved"),
          db.raw("COUNT(CASE WHEN status = 'Closed' THEN 1 END) as closed"),
          db.raw("COUNT(CASE WHEN priority = 'Critical' THEN 1 END) as critical")
        )
        .first();

      // Convert to numbers
      return {
        total: parseInt(stats.total) || 0,
        open: parseInt(stats.open) || 0,
        inProgress: parseInt(stats.inProgress) || 0,
        resolved: parseInt(stats.resolved) || 0,
        closed: parseInt(stats.closed) || 0,
        critical: parseInt(stats.critical) || 0
      };
    } catch (error) {
      logger.error('Error fetching ticket stats:', error);
      throw new Error('Failed to fetch ticket statistics');
    }
  }
}

export default new TicketModel();
