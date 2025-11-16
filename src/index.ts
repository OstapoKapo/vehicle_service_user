import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(cookieParser()); 
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


import userRoutes from './routes/authRouters.js';

app.use(express.json());

app.use('/auth', userRoutes);

app.listen(PORT, () => {
  console.log(`User service запущено на порті ${PORT}`);
});