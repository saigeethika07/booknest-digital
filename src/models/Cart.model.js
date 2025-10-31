import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [CartItemSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);


