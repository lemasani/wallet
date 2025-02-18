import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expenseRoutes from './routes/expenseRoutes';
import { errorHandler } from './middlewares/errorHandler';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
	res.send('Expense Tracker Backend is running!');
});

// Error handling middleware (should be added after routes)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
