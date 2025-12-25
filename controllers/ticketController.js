import { readJsonFile, writeJsonFile } from '../utils/fileHelper.js';
import { validateUser } from './userController.js';
import { findEventByName, updateEvent } from './eventController.js';


export const buyTickets = async (req,res)=>{
     try {
    const { username, password, eventName, quantity } = req.body;

    if (!username || !password || !eventName || !quantity) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await validateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const event = await findEventByName(eventName);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.ticketsAvailable < quantity) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }

    const receipt = {
      username,
      eventName,
      ticketsBought: quantity
    };

    const receipts = await readJsonFile('receipts.json');
    receipts.push(receipt);
    await writeJsonFile('receipts.json', receipts);

    await updateEvent(eventName, event.ticketsAvailable - quantity);

    return res.status(200).json({ message: 'Tickets purchased successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};