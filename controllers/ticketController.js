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
// bonus 1
    const users = await readJsonFile('users.json');
    const fullUser = users.find(u => u.username === username);
    if (fullUser?.role === 'user') {
      return res.status(403).json({ error: 'Only admin users can buy tickets' });
    }

    const event = await findEventByName(eventName);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.ticketsAvailable < quantity) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }

    const receipt = {
      id: Date.now().toString(),
      username,
      eventName,
      ticketsBought: quantity,
      status: 'active',
      purchasedAt: new Date().toISOString()
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


// bonus 2
export const transferTicket = async (req, res) => {
  try {
    const { username, password, receiptId, newOwnerUsername } = req.body;

    if (!username || !password || !receiptId || !newOwnerUsername) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await validateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const users = await readJsonFile('users.json');
    const newOwner = users.find(u => u.username === newOwnerUsername);
    if (!newOwner) {
      return res.status(404).json({ error: 'New owner user not found' });
    }

    const receipts = await readJsonFile('receipts.json');
    const receipt = receipts.find(r => r.id === receiptId && r.username === username && r.status === 'active');
    
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found or already transferred/refunded' });
    }

    receipt.previousOwner = receipt.username;
    receipt.username = newOwnerUsername;
    receipt.transferredAt = new Date().toISOString();

    await writeJsonFile('receipts.json', receipts);

    return res.status(200).json({ message: 'Ticket transferred successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// bonus 3
export const refundTicket = async (req, res) => {
  try {
    const { username, password, receiptId } = req.body;

    if (!username || !password || !receiptId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await validateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const receipts = await readJsonFile('receipts.json');
    const receipt = receipts.find(r => r.id === receiptId && r.username === username && r.status === 'active');
    
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found or already refunded' });
    }

    const event = await findEventByName(receipt.eventName);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    receipt.status = 'refunded';
    receipt.refundedAt = new Date().toISOString();

    await writeJsonFile('receipts.json', receipts);
    await updateEvent(receipt.eventName, event.ticketsAvailable + receipt.ticketsBought);

    return res.status(200).json({ 
      message: 'Ticket refunded successfully', 
      ticketsReturned: receipt.ticketsBought 
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};