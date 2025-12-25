import { readJsonFile } from "../utils/fileHelper.js";

 export const getUserSummary = async (req, res) => {
  try {
    const { username } = req.params;

    const receipts = await readJsonFile('receipts.json');

    const userReceipts = receipts.filter(r => r.username === username);

    if (userReceipts.length === 0) {
      return res.status(200).json({
        totalTicketsBought: 0,
        events: [],
        averageTicketsPerEvent: 0
      });
    }

    const totalTicketsBought = userReceipts.reduce((sum, r) => sum + r.ticketsBought, 0);
    const uniqueEvents = [...new Set(userReceipts.map(r => r.eventName))];
    const averageTicketsPerEvent = totalTicketsBought / uniqueEvents.length;

    return res.status(200).json({
      totalTicketsBought,
      events: uniqueEvents,
      averageTicketsPerEvent: Math.round(averageTicketsPerEvent * 100) / 100
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

