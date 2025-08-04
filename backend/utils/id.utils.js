// Utility functions for handling ticket ID transformations

export function formatTicketId(numericId) {
  return `TKT-${String(numericId).padStart(3, '0')}`;
}

export function parseTicketId(ticketId) {
  if (typeof ticketId === 'number') {
    return ticketId;
  }

  if (typeof ticketId === 'string' && ticketId.startsWith('TKT-')) {
    const numericPart = ticketId.replace('TKT-', '');
    const parsed = parseInt(numericPart, 10);

    if (isNaN(parsed)) {
      throw new Error(`Invalid ticket ID format: ${ticketId}`);
    }

    return parsed;
  }

  throw new Error(`Invalid ticket ID format: ${ticketId}`);
}

export function isValidTicketId(ticketId) {
  try {
    parseTicketId(ticketId);
    return true;
  } catch {
    return false;
  }
}
