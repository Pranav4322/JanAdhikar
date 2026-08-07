import { Router } from 'express';
import { createProject, getAllProjects, getProjectById, addExpense } from '../controllers/project.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', authenticate, requireRole('official', 'admin'), createProject);
router.post('/:id/expenses', authenticate, requireRole('official', 'admin'), addExpense);

export default router;