import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import notesRoutes from './routes/notesRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors(
    {
        origin: "http://localhost:5173"
    }
));
app.use(express.json());
app.use(rateLimiter);
app.use('/api/notes', notesRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
