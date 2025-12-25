import express from 'express';
import { buyTickets } from '../controllers/ticketController.js';
import { getUserSummary } from '../controllers/summaryController.js';


export const ticketRoutes = express.Router();

ticketRoutes.post('/tickets/buy', buyTickets);
ticketRoutes.get('/:username/summary', getUserSummary);