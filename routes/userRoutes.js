import express from 'express';
import { registerUser } from '../controllers/userController.js';

export const userRoutes = express.Router();

userRoutes.post('/register', registerUser);