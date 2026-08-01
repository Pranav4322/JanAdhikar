import { Router } from 'express';
import { createComplaint, getMyComplaints } from '../controllers/complaint.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createComplaint);
router.get('/mine', authenticate, getMyComplaints);

export default router;