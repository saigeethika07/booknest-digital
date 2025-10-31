import express from 'express';
import Order from '../models/Order.model.js';
import Book from '../models/Book.model.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId || '000000000000000000000000';
    const { cartItems, total, paymentMethod, shippingInfo } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    const itemIds = cartItems.map((it) => it.bookId);
    const books = await Book.find({ _id: { $in: itemIds } });
    const booksById = new Map(books.map((b) => [String(b._id), b]));

    const items = cartItems.map((it) => ({
      bookId: it.bookId,
      quantity: it.quantity,
      price: booksById.get(String(it.bookId))?.price || 0
    }));
    const subtotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const shipping = 5;
    const tax = +(subtotal * 0.1).toFixed(2);
    const computedTotal = +(subtotal + shipping + tax).toFixed(2);

    const order = await Order.create({
      userId,
      items,
      subtotal,
      shipping,
      tax,
      total: computedTotal,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid',
      shippingInfo: shippingInfo || {}
    });

    return res.json({ success: true, orderId: String(order._id), total: computedTotal });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Payment failed', error: e.message });
  }
});

export default router;


