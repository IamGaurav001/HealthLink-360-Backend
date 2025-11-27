import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        
        // Start server only after a successful DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // Exit the process on connection failure
    });

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});