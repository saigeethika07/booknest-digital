import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

UserSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model('User', UserSchema);


