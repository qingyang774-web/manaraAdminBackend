import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { connectDB } from './lib/db';
import universityRoutes from './routes/universityRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ message: 'Manara Admin API is running' });
});

app.use('/api/universities', universityRoutes);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

