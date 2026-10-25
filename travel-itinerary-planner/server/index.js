import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
const app = express();
const allowed = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({ origin(origin, cb) { if (!origin || allowed.includes(origin)) return cb(null, true); cb(new Error('Origin not allowed')); } }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../client/dist');
if (process.env.NODE_ENV === 'production') { app.use(express.static(dist)); app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(dist, 'index.html'))); }
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, req, res, next) => { console.error(error); if (error.code === 11000) return res.status(409).json({ message: 'Email already registered.' }); if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: 'Invalid information provided.' }); res.status(500).json({ message: 'Something went wrong. Please try again.' }); });
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace_this_with_a_long_random_secret') { console.error('Set MONGODB_URI and a secure JWT_SECRET in server/.env'); process.exit(1); }
try { await mongoose.connect(process.env.MONGODB_URI); app.listen(process.env.PORT || 5000, () => console.log(`API running on port ${process.env.PORT || 5000}`)); }
catch (e) { console.error('Could not connect to MongoDB:', e.message); process.exit(1); }
