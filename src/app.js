import express from 'express'
import cors from 'cors'
import authRouter from './controllers/authRoute.js';
import userRouter from './controllers/userRoute.js';

export const app = express();

console.log('CryptoX API Starting up')

app.use(cors({
  origin: true, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use(express.json());

app.use('/api/auth', authRouter); 
app.use('/api/user', userRouter);
