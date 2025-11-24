import path from 'node:path';
import 'dotenv/config';
import fs from 'fs/promises';
import { connectDB } from '../lib/db';
import { UniversityModel } from '../models/University';

const dataPath = path.resolve(__dirname, '../../../ManaraAdminFrontend/src/data/universities.json');

const seed = async () => {
  await connectDB();

  const raw = await fs.readFile(dataPath, 'utf-8');
  const universities = JSON.parse(raw);

  await UniversityModel.deleteMany({});
  await UniversityModel.insertMany(universities);

  console.log(`Imported ${universities.length} universities`);
  process.exit(0);
};

seed().catch((error) => {
  console.error('Failed to seed database', error);
  process.exit(1);
});
