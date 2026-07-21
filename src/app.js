import express from 'express'
import cors from 'cors'
import authRouter from './controllers/authRoute.js';
import userRouter from './controllers/userRoute.js';

export const app = express();

// 1. Sabhi origins ko temporary allow karein testing ke liye
app.use(cors({
  origin: true, // Ye dynamically request bhejnewale origin ko allow kar dega
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Preflight (OPTIONS) requests ke liye handle karein
app.options('*', cors()); 

app.use(express.json());

app.use('/api/auth', authRouter); 
app.use('/api/user', userRouter);
