import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRouters.js';
import userRoute from './routes/userRouters.js';
import { errorMiddleware } from './common/middleware/error.middleware.js';
import helmet from 'helmet';

dotenv.config();
const app = express();
app.use(cookieParser()); 
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use('/auth', authRoute);
app.use('/users', userRoute)
app.use(errorMiddleware); 

app.listen(PORT, () => {
  console.log(`User service запущено на порті ${PORT}`);
});