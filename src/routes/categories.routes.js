import express from 'express';
import Category from '../models/Category.model.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return res.json({ success: true, categories });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'name is required' });
    }
    const created = await Category.create({ name });
    return res.status(201).json({ success: true, category: created });
  } catch (e) {
    // If unique constraint violated, report conflict
    if (e?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }
    return res.status(500).json({ success: false, message: 'Failed to create category', error: e.message });
  }
});

export default router;


