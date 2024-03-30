import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './db/connectdb.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectdb();

const app = express();  

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Get the directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use('/useruploads', express.static(path.join(__dirname, 'useruploads')));
app.use('/postuploads', express.static(path.join(__dirname, 'postuploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
