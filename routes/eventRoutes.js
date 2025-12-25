import express from 'express';
import { createEvent } from '../controllers/eventController.js';


export const eventRoutes = express.Router();

eventRoutes.post('/events', createEvent);