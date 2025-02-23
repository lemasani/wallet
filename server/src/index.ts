import express, { NextFunction, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import  db from '../src/utils/db';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Connect to the database and start server
async function startServer() {
    try {
        await db.$connect();
        console.log('Successfully connected to the database');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}

startServer();

// Cleanup on server shutdown
process.on('SIGINT', async () => {
    await db.$disconnect();
    process.exit(0);
});