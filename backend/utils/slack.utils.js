import fetch from 'node-fetch';
import { config } from '../config/environment.js';
import logger from './logger.js';

export async function sendSlackNotification(ticket, action = 'created') {
  if (!config.slack.enabled || !config.slack.webhookUrl) {
    logger.warn('Slack notifications disabled or webhook URL not configured');
    return { success: false, reason: 'Slack not configured' };
  }

  try {
    const message = createSlackMessage(ticket, action);

    const response = await fetch(config.slack.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Slack API returned ${response.status}: ${response.statusText}`);
    }

    logger.info(`Slack notification sent successfully for ticket ${ticket.id}`);
    return { success: true };

  } catch (error) {
    logger.error('Failed to send Slack notification:', {
      ticketId: ticket.id,
      action,
      error: error.message
    });

    return { 
      success: false, 
      error: error.message 
    };
  }
}

function createSlackMessage(ticket, action) {
  const actionText = getActionText(action, ticket);
  const color = getSlackColor(ticket, action);

  return {
    text: actionText,
    attachments: [
      {
        color: color,
        fields: [
          {
            title: 'Ticket ID',
            value: ticket.id,
            short: true
          },
          {
            title: 'Priority',
            value: ticket.priority,
            short: true
          },
          {
            title: 'Team',
            value: ticket.team,
            short: true
          },
          {
            title: 'Status',
            value: ticket.status,
            short: true
          },
          {
            title: 'Assigned To',
            value: ticket.assignedMember || 'Unassigned',
            short: true
          },
          {
            title: 'Submitter',
            value: `${ticket.submitterName} <${ticket.submitterEmail}>`,
            short: true
          },
          {
            title: 'Description',
            value: ticket.description.length > 300 
              ? ticket.description.substring(0, 300) + '...'
              : ticket.description,
            short: false
          }
        ],
        footer: 'bunq Support Dashboard',
        ts: Math.floor(new Date(ticket.lastUpdated || ticket.createdDate).getTime() / 1000)
      }
    ]
  };
}

function getActionText(action, ticket) {
  switch (action) {
    case 'created':
      return `🎫 New ticket created: ${ticket.title}`;
    case 'updated':
      return `📝 Ticket updated: ${ticket.title}`;
    case 'status_changed':
      return `🔄 Ticket status changed: ${ticket.title}`;
    case 'resolved':
      return `✅ Ticket resolved: ${ticket.title}`;
    case 'closed':
      return `🔒 Ticket closed: ${ticket.title}`;
    default:
      return `🎫 Ticket ${action}: ${ticket.title}`;
  }
}

function getSlackColor(ticket, action) {
  // Priority-based colors
  if (ticket.priority === 'Critical') return '#d00000'; // Red
  if (ticket.priority === 'High') return '#ff6b00'; // Orange
  if (ticket.priority === 'Medium') return '#ffd60a'; // Yellow

  // Action-based colors
  if (action === 'resolved') return '#2d8f3f'; // Green
  if (action === 'closed') return '#6c757d'; // Gray

  // Default color for low priority and general actions
  return '#36a64f'; // Green
}

// Send notification for status changes specifically
export async function sendStatusChangeNotification(ticket, oldStatus, newStatus) {
  const enhancedTicket = {
    ...ticket,
    statusChange: {
      from: oldStatus,
      to: newStatus
    }
  };

  let action = 'status_changed';
  if (newStatus === 'Resolved') action = 'resolved';
  if (newStatus === 'Closed') action = 'closed';

  return await sendSlackNotification(enhancedTicket, action);
}

export default {
  sendSlackNotification,
  sendStatusChangeNotification
};
