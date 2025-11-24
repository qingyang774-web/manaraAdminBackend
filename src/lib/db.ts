import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://localhost:27017/manara-admin';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI ?? DEFAULT_URI;

  await mongoose.connect(uri, {
    autoIndex: true
  });

  console.log('Connected to MongoDB');
};