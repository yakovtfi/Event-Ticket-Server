import { readJsonFile, writeJsonFile } from '../utils/fileHelper.js';
import { validateUser } from './userController.js';


export const createEvent = async (req, res) => {
  try {
    const { eventName, ticketsForSale, username, password } = req.body;

    if (!eventName || !ticketsForSale || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await validateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const events = await readJsonFile('events.json');

    const newEvent = {
      eventName,
      ticketsAvailable: ticketsForSale,
      createdBy: username
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
