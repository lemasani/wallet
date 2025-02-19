import express, { NextFunction, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


// Health check
app.get('/', (req: Request, res: Response) => {
	res.send('Wallet core running!');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	errorHandler(err, req, res, next);
});


// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
