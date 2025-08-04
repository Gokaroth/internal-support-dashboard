import TicketModel from '../models/ticket.model.js';
import { sendSlackNotification, sendStatusChangeNotification } from '../utils/slack.utils.js';
import logger from '../utils/logger.js';

export const getAllTickets = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      team: req.query.team,
      priority: req.query.priority,
      search: req.query.search
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    const tickets = await TicketModel.findAll(filters);

    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await TicketModel.findByTicketId(id);

    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found',
        message: `Ticket with ID ${id} does not exist`
      });
    }

    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req, res, next) => {
  try {
    const ticketData = {
      title: generateTitle(req.body.issueType, req.body.description),
      issueType: req.body.issueType,
      priority: req.body.priority || getAutoPriority(req.body.description),
      team: req.body.team || getAutoAssignedTeam(req.body.issueType),
      status: 'Open',
      description: req.body.description,
      submitterName: req.body.submitterName,
      submitterEmail: req.body.submitterEmail,
      assignedMember: req.body.assignedMember || getNextAssignedMember(req.body.team || getAutoAssignedTeam(req.body.issueType))
    };

    const ticket = await TicketModel.create(ticketData);

    // Send Slack notification asynchronously
    sendSlackNotification(ticket, 'created').catch(error => {
      logger.warn('Slack notification failed:', error);
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Get current ticket for status change detection
    const currentTicket = await TicketModel.findByTicketId(id);
    if (!currentTicket) {
      return res.status(404).json({
        error: 'Ticket not found',
        message: `Ticket with ID ${id} does not exist`
      });
    }

    const updatedTicket = await TicketModel.updateByTicketId(id, updateData);

    // Send Slack notification for status changes
    if (updateData.status && updateData.status !== currentTicket.status) {
      sendStatusChangeNotification(updatedTicket, currentTicket.status, updateData.status).catch(error => {
        logger.warn('Slack status notification failed:', error);
      });
    }

    res.json(updatedTicket);
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await TicketModel.deleteByTicketId(id);

    res.json({
      message: `Ticket ${id} deleted successfully`,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketStats = async (req, res, next) => {
  try {
    const stats = await TicketModel.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// Helper functions (matching frontend logic)
function generateTitle(issueType, description) {
  const words = description.split(' ').slice(0, 6).join(' ');
  return `${issueType}: ${words}${words.length < description.length ? '...' : ''}`;
}

function getAutoAssignedTeam(issueType) {
  const assignments = {
    "Bug": "dev",
    "Technical Issue": "dev",
    "Feature Request": "product",
    "Performance Issue": "devops",
    "Security Issue": "devops",
    "Account Issue": "support",
    "Other": "support"
  };
  return assignments[issueType] || "support";
}

function getAutoPriority(description) {
  const priorityKeywords = {
    critical: ["urgent", "critical", "down", "broken", "crash", "error", "failure"],
    high: ["important", "blocking", "major", "severe"],
    medium: ["enhancement", "improvement", "update", "change"],
    low: ["minor", "cosmetic", "suggestion", "question"]
  };

  const lowerDescription = description.toLowerCase();

  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    if (keywords.some(keyword => lowerDescription.includes(keyword))) {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    }
  }

  return 'Low';
}

function getNextAssignedMember(teamId) {
  const teams = {
    dev: { members: ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince"] },
    qa: { members: ["Eve Wilson", "Frank Miller", "Grace Lee"] },
    devops: { members: ["Henry Ford", "Iris Watson", "Jack Ryan"] },
    support: { members: ["Kate Stevens", "Leo Torres", "Mia Chang"] },
    product: { members: ["Noah Davis", "Olivia Martinez", "Paul Anderson"] }
  };

  const team = teams[teamId];
  if (!team || !team.members.length) return 'Unassigned';

  // Simple round-robin assignment (in production, you might want to track this in database)
  const randomIndex = Math.floor(Math.random() * team.members.length);
  return team.members[randomIndex];
}
