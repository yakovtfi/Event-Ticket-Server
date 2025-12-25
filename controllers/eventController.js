import { readJsonFile, writeJsonFile } from '../utils/fileHelper.js';
import { validateUser } from './userController.js';


export const validateUserRole = async (username, password) => {
  const users = await readJsonFile('users.json');
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return null;
  if (user.role === 'admin') {
    return { error: 'Admin users cannot create events' };
  }
  return user;
};

export const createEvent = async (req, res) => {
  try {
    const { eventName, ticketsForSale, username, password } = req.body;

    if (!eventName || !ticketsForSale || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
// bonus 1
    const userValidation = await validateUserRole(username, password);
    if (!userValidation || userValidation.error) {
      return res.status(401).json({ error: userValidation?.error || 'Invalid credentials' });
    }
    const user = userValidation;

    const events = await readJsonFile('events.json');


    const newEvent = {
      id: Date.now(),
      eventName,
      ticketsAvailable: ticketsForSale,
      createdBy: username,
      createdAt: new Date().toISOString()
    };

    events.push(newEvent);
    await writeJsonFile('events.json', events);

    return res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export const findEventByName = async (eventName) => {
  const events = await readJsonFile('events.json');
  return events.find(e => e.eventName.toLowerCase() === eventName.toLowerCase());
};

export const updateEvent = async (eventName, ticketsAvailable) => {
  const events = await readJsonFile('events.json');
  const event = events.find(e => e.eventName.toLowerCase() === eventName.toLowerCase());
  
  if (event) {
    event.ticketsAvailable = ticketsAvailable;
    await writeJsonFile('events.json', events);
  }
};
