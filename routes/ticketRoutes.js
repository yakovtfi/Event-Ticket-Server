import express from 'express';
import { buyTickets, transferTicket, refundTicket } from '../controllers/ticketController.js';
import { getUserSummary } from '../controllers/summaryController.js';


export const ticketRoutes = express.Router();

ticketRoutes.post('/tickets/buy', buyTickets);
ticketRoutes.post('/tickets/transfer', transferTicket); // bonus 2
ticketRoutes.post('/tickets/refund', refundTicket); // bonus 3
ticketRoutes.get('/:username/summary', getUserSummary);