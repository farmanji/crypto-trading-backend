import express from 'express'
import cors from 'cors'
import authRouter from './controllers/authRoute.js';
import userRouter from './controllers/userRoute.js';
export const app = express();



app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://crypto-tradings-platform.netlify.app"
  ],
  credentials: true
}));

app.options('*', cors()); 

app.use(express.json());
app.use('/api/auth', authRouter); 
app.use('/api/user', userRouter); 
