import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI || '');
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
