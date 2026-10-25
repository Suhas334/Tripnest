import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const safeUser = user => ({ id: user._id, name: user.name, email: user.email });
const makeToken = user => jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');
    if (!name || name.length > 60 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return res.status(400).json({ message: 'Enter a name, valid email and password of at least 6 characters.' });
    if (await User.exists({ email })) return res.status(409).json({ message: 'Email already registered.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: makeToken(user), user: safeUser(user) });
  } catch (error) { next(error); }
});
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.password))) return res.status(401).json({ message: 'Incorrect email or password.' });
    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch (error) { next(error); }
});
router.get('/me', requireAuth, async (req, res, next) => {
  try { const user = await User.findById(req.userId); if (!user) return res.status(404).json({ message: 'Account not found.' }); res.json({ user: safeUser(user) }); }
  catch (error) { next(error); }
});
export default router;
