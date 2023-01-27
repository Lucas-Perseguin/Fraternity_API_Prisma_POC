import express from 'express';
import dotenv from 'dotenv';
import houseworskRouter from './routes/houseworks.route.js';
import residentsRouter from './routes/residents.route.js';
import billsRouter from './routes/bills.route.js';

dotenv.config();

const server = express();
server.use(express.json());

server.use(residentsRouter);
server.use(houseworskRouter);
server.use(billsRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
