import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 5 },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'paypal'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'paid' },
  shippingInfo: { type: Object, default: {} }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);


