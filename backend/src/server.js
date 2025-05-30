import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import connectDB from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import notesRoutes from './routes/notesRoutes.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(cors(
        {
            origin: "http://localhost:5173"
        }
    ));
}
app.use(express.json());
app.use(rateLimiter);
app.use('/api/notes', notesRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.use("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
