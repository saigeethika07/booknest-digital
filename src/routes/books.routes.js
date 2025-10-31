import express from 'express';
import Book from '../models/Book.model.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    const response = books.map((b) => ({
      id: b._id,
      title: b.title,
      author: b.author,
      description: b.description,
      category: b.category,
      image: b.image,
      price: b.price,
      rating: b.rating
    }));
    return res.json({ success: true, books: response });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to fetch books', error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, author, description, category, image, price, rating } = req.body;
    if (!title || !author || price === undefined) {
      return res.status(400).json({ success: false, message: 'title, author and price are required' });
    }
    const created = await Book.create({
      title,
      author,
      description: description || '',
      category: category || '',
      image: image || '',
      price: Number(price),
      rating: rating !== undefined ? Number(rating) : 0
    });
    const response = {
      id: created._id,
      title: created.title,
      author: created.author,
      description: created.description,
      category: created.category,
      image: created.image,
      price: created.price,
      rating: created.rating
    };
    return res.status(201).json({ success: true, book: response });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to create book', error: e.message });
  }
});

export default router;


