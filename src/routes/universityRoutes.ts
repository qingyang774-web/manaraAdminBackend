import { Router } from 'express';
import {
  createUniversity,
  deleteUniversity,
  getUniversities,
  getUniversity,
  updateUniversity
} from '../controllers/universityController';

const router = Router();

router.get('/', getUniversities);
router.get('/:id', getUniversity);
router.post('/', createUniversity);
router.put('/:id', updateUniversity);
router.delete('/:id', deleteUniversity);

export default router;

