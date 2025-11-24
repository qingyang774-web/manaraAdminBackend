import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/manara-admin';

export const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true
  });

  console.log('Connected to MongoDB');
};

