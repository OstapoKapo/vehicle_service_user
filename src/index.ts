import express from 'express';
import dotenv from 'dotenv'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

import userRoutes from './routes/userRouters.js';

app.use(express.json());

app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`User service запущено на порті ${PORT}`);
});