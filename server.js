import express from 'express';
import {userRoutes} from './routes/userRoutes.js';
import {eventRoutes} from './routes/eventRoutes.js';
import {ticketRoutes} from './routes/ticketRoutes.js';



const app = express();
const PORT = 3000;

app.use(express.json());


app.use('/user', userRoutes);
app.use('/creator', eventRoutes);
app.use('/users', ticketRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
