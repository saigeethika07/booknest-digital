import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, index: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 }
}, { timestamps: true });

export default mongoose.model('Book', BookSchema);


