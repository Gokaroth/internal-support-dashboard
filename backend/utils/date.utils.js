// Utility functions for handling date transformations between frontend and backend

export function formatDatesForFrontend(ticket) {
  return {
    createdDate: ticket.created_at ? new Date(ticket.created_at).toISOString() : null,
    lastUpdated: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : null
  };
}

export function formatDatesForDatabase(ticketData) {
  const result = {};

  if (ticketData.createdDate) {
    result.created_at = new Date(ticketData.createdDate);
  }

  if (ticketData.lastUpdated) {
    result.updated_at = new Date(ticketData.lastUpdated);
  }

  return result;
}

export function getCurrentTimestamp() {
  return new Date().toISOString();
}
