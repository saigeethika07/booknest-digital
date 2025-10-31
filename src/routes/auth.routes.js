import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Signup failed', error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Login failed', error: e.message });
  }
});

export default router;


