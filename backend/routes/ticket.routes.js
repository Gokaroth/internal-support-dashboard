import express from 'express';
import { 
  getAllTickets, 
  getTicketById, 
  createTicket, 
  updateTicket, 
  deleteTicket,
  getTicketStats 
} from '../controllers/ticket.controller.js';
import { validateTicketCreation, validateTicketUpdate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Get ticket statistics
router.get('/stats', getTicketStats);

// Get all tickets with optional filtering
router.get('/', getAllTickets);

// Get specific ticket
router.get('/:id', getTicketById);

// Create new ticket
router.post('/', validateTicketCreation, createTicket);

// Update ticket
router.patch('/:id', validateTicketUpdate, updateTicket);

// Delete ticket
router.delete('/:id', deleteTicket);

export default router;
